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

//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, vJAXB 2.0 in JDK 1.6
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a>
// Any modifications to this file will be lost upon recompilation of the source schema.
// Generated on: 2008.03.26 at 10:28:06 PM ART
//


package com.wisemapping.xml.mindmap;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each
 * Java content interface and Java element interface
 * generated in the generated package.
 * <p>An ObjectFactory allows you to programatically
 * construct new instances of the Java representation
 * for XML content. The Java representation of XML
 * content can consist of schema derived interfaces
 * and classes representing the binding of schema
 * type definitions, element declarations and model
 * groups.  Factory methods for each of these are
 * provided in this class.
 *
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _Topic_QNAME = new QName("", "topic");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: generated
     *
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link Link }
     *
     */
    public Link createLink() {
        return new Link();
    }

    /**
     * Create an instance of {@link Icon }
     *
     */
    public Icon createIcon() {
        return new Icon();
    }

    /**
     * Create an instance of {@link Map }
     *
     */
    public Map createMap() {
        return new Map();
    }

    /**
     * Create an instance of {@link TopicType }
     *
     */
    public TopicType createTopicType() {
        return new TopicType();
    }

    /**
     * Create an instance of {@link Note }
     *
     */
    public Note createNote() {
        return new Note();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link TopicType }{@code >}}
     *
     */
    @XmlElementDecl(namespace = "", name = "topic")
    public JAXBElement<TopicType> createTopic(TopicType value) {
        return new JAXBElement<TopicType>(_Topic_QNAME, TopicType.class, null, value);
    }

}
