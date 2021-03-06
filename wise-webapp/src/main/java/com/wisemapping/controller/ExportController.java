/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

package com.wisemapping.controller;

import com.wisemapping.exporter.ExportFormat;
import com.wisemapping.model.MindMap;
import com.wisemapping.service.MindmapService;
import com.wisemapping.view.MindMapBean;
import com.wisemapping.exporter.ExportProperties;
import com.wisemapping.filter.UserAgent;
import org.apache.batik.transcoder.TranscoderException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.multiaction.NoSuchRequestHandlingMethodException;

import javax.servlet.ServletOutputStream;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.JAXBException;
import java.io.IOException;

public class ExportController extends BaseMultiActionController {
    private static final String IMG_EXPORT_FORMAT = "IMG_EXPORT_FORMAT";
    private static final String MAP_ID_PARAMETER = "mapId";
    private static final String EXPORT_FORMAT_PARAMETER = "exportFormat";
    private static final String IMG_SIZE_PARAMETER = "imgSize";


    public ModelAndView handleNoSuchRequestHandlingMethod(NoSuchRequestHandlingMethodException noSuchRequestHandlingMethodException, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception {
        logger.info("Mindmap Controller: EXPORT action");
        final MindMap mindmap = getMindmapFromRequest(httpServletRequest);
        return new ModelAndView("mindmapExport", "mindmap", new MindMapBean(mindmap));
    }

    public ModelAndView export(HttpServletRequest request, HttpServletResponse response) throws TranscoderException, IOException, JAXBException {
        logger.info("Export Controller: exporting WiseMap action");

        final String mapIdStr = request.getParameter(MAP_ID_PARAMETER);
        if (mapIdStr != null) {
            try {

                int mindmapId = Integer.parseInt(mapIdStr);

                String formatStr = request.getParameter(EXPORT_FORMAT_PARAMETER);
                if (IMG_EXPORT_FORMAT.endsWith(formatStr)) {
                    formatStr = request.getParameter("imgFormat");
                }

                final MindmapService service = getMindmapService();
                final MindMap mindMap = service.getMindmapById(mindmapId);

                // Build format properties ...
                final ExportFormat format = ExportFormat.valueOf(formatStr);
                final ExportProperties properties = ExportProperties.create(format);
                if (properties instanceof ExportProperties.ImageProperties) {
                    final String sizeStr = request.getParameter(IMG_SIZE_PARAMETER);
                    final ExportProperties.ImageProperties imageProperties = (ExportProperties.ImageProperties) properties;
                    if (sizeStr != null) {
                        final ExportProperties.ImageProperties.Size size = ExportProperties.ImageProperties.Size.valueOf(sizeStr);
                        imageProperties.setSize(size);
                    } else {
                        imageProperties.setSize(ExportProperties.ImageProperties.Size.LARGE);
                    }
                }

                // Change image link URL.
                setBaseBaseImgUrl(format, properties);

                // Set format content type...
                final String contentType = format.getContentType();
                response.setContentType(contentType);

                // Set file name...
                final String fileName = mindMap.getTitle() + "." + format.getFileExtension();
                response.setHeader("Content-Disposition", "attachment;filename=" + fileName);

                // Write content ...
                final ServletOutputStream outputStream = response.getOutputStream();
                mindMap.export(properties, outputStream);


            } catch (Throwable e) {
                logger.error("Unexpexted error during export process", e);
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            }
        } else {
            logger.warn("mapIdStr is null.Image could not be imported. UserAgent:" + request.getHeaders(UserAgent.USER_AGENT_HEADER));
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
        return null;
    }

    private void setBaseBaseImgUrl(ExportFormat format, ExportProperties properties) {

        final String baseUrl;
        if (format == ExportFormat.SVG) {
            baseUrl = "http://www.wisemapping.com/images";
        } else {
            final ServletContext servletContext = this.getServletContext();
            baseUrl = "file://" + servletContext.getRealPath("/images/");
        }
        properties.setBaseImagePath(baseUrl);
    }

    public ModelAndView print(HttpServletRequest request, HttpServletResponse response) throws TranscoderException, IOException, JAXBException {
        logger.info("Export Controller: printing WiseMap action");

        final String mapIdStr = request.getParameter(MAP_ID_PARAMETER);
        int mindmapId = Integer.parseInt(mapIdStr);
        final MindmapService service = getMindmapService();
        final MindMap mindMap = service.getMindmapById(mindmapId);

        return new ModelAndView("mindmapPrint", "mindmap", mindMap);

    }

    public ModelAndView image(HttpServletRequest request, HttpServletResponse response) throws TranscoderException, IOException, JAXBException {
        try {
            logger.info("Export Controller: generating image WiseMap action");

            final String mapIdStr = request.getParameter(MAP_ID_PARAMETER);
            int mindmapId = Integer.parseInt(mapIdStr);
            final MindmapService service = getMindmapService();
            final MindMap mindMap = service.getMindmapById(mindmapId);

            //Image Format
            ExportFormat imageFormat = ExportFormat.PNG;

            // Build format properties ...
            final ExportProperties.ImageProperties imageProperties = new ExportProperties.ImageProperties(imageFormat);
            imageProperties.setSize(ExportProperties.ImageProperties.Size.XMEDIUM);

            // Change image link URL.
            setBaseBaseImgUrl(imageFormat, imageProperties);

            // Set format content type...
            response.setContentType(imageFormat.getContentType());

            // Write content ...
            final ServletOutputStream outputStream = response.getOutputStream();
            mindMap.export(imageProperties, outputStream);


        } catch (Throwable e) {
            logger.error("Unexpexted error generating the image", e);
        }
        return null;
    }
}