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

mindplot.Topic = function()
{
    mindplot.Topic.superClass.initialize.call(this);
};

objects.extend(mindplot.Topic, mindplot.NodeGraph);

mindplot.Topic.prototype.initialize = function(topicBoard)
{
    core.assert(core.Utils.isDefined(topicBoard), 'topic board can not be null.');

    this._children = [];
    this._parent = null;
    this._lastIconId = -1;

    this._topicBoard = topicBoard;
    this._buildShape();
    this.setMouseEventsEnabled(true);

    // Positionate topic ....
    var model = this.getModel();
    var pos = model.getPosition();
    if (pos != null)
    {
        this.setPosition(pos);
    }
};

mindplot.Topic.prototype.setShapeType = function(type)
{
    this._setShapeType(type, true);

};

mindplot.Topic.prototype.getParent = function()
{
    return this._parent;
};

mindplot.Topic.prototype._setShapeType = function(type, updateModel)
{
    // Remove inner shape figure ...
    var model = this.getModel();
    if (updateModel)
    {
        model.setShapeType(type);
    }

    var innerShape = this.getInnerShape();
    if (innerShape != null)
    {
        var dispatcherByEventType = innerShape._dispatcherByEventType;
        // Remove old shape ...
        this._removeInnerShape();

        // Create a new one ...
        innerShape = this.getInnerShape();

        //Let's register all the events. The first one is the default one. The others will be copied.
        this._registerDefaultListenersToElement(innerShape, this);

        var dispatcher = dispatcherByEventType['mousedown'];
        if(dispatcher)
        {
            for(var i = 1; i<dispatcher._listeners.length; i++)
            {
                innerShape.addEventListener('mousedown', dispatcher._listeners[i]);
            }
        }
        if (!this.isConnectedToCentralTopic() && type == mindplot.NodeModel.SHAPE_TYPE_LINE)
        {
            // In this case, The normal connection line is not used.
            innerShape.setVisibility(false);
        }

        // Update figure size ...
        var size = model.getSize();
        this.setSize(size, true);

        var group = this.get2DElement();
        group.appendChild(innerShape);

        // Move text to the front ...
        var text = this.getTextShape();
        text.moveToFront();

        //Move iconGroup to front ...
        var iconGroup = this.getIconGroup();
        if($chk(iconGroup)){
            iconGroup.moveToFront();
        }
    }

};

mindplot.Topic.prototype.getShapeType = function()
{
    var model = this.getModel();
    var result = model.getShapeType();
    if (!result)
    {
        result = this._defaultShapeType();
    }
    return result;
};

mindplot.Topic.prototype._removeInnerShape = function()
{
    var group = this.get2DElement();
    var innerShape = this.getInnerShape();
    group.removeChild(innerShape);
    this._innerShape = null;
};

mindplot.Topic.prototype.INNER_RECT_ATTRIBUTES = {stroke:'0.5 solid'};
mindplot.Topic.prototype.getInnerShape = function()
{
    if (!this._innerShape)
    {
        // Create inner box.
        this._innerShape = this.buildShape(this.INNER_RECT_ATTRIBUTES);

        // Update bgcolor ...
        var bgColor = this.getBackgroundColor();
        this._setBackgroundColor(bgColor, false);

        // Update border color ...
        var brColor = this.getBorderColor();
        this._setBorderColor(brColor, false);

        // Define the pointer ...
        if (this.getType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
        {
            this._innerShape.setCursor('move');
        } else
        {
            this._innerShape.setCursor('default');
        }

    }
    return this._innerShape;
};


mindplot.Topic.prototype.buildShape = function(attributes, type)
{
    var result;
    if (!core.Utils.isDefined(type))
    {
        type = this.getShapeType();
    }

    if (type == mindplot.NodeModel.SHAPE_TYPE_RECT)
    {
        result = new web2d.Rect(0, attributes);
    }
    else if (type == mindplot.NodeModel.SHAPE_TYPE_ELIPSE)
    {
        result = new web2d.Elipse(attributes);
    }
    else if (type == mindplot.NodeModel.SHAPE_TYPE_ROUNDED_RECT)
    {
        result = new web2d.Rect(0.3, attributes);
    }
    else if (type == mindplot.NodeModel.SHAPE_TYPE_LINE)
    {
        result = new web2d.Line();
        result.setSize = function(width, height)
        {
            this.size = {width:width, height:height};
            result.setFrom(-1, height);
            result.setTo(width + 1, height);

            // Lines will have the same color of the default connection lines...
            var stokeColor = mindplot.ConnectionLine.getStrokeColor();
            result.setStroke(1, 'solid', stokeColor);
        };

        result.getSize = function()
        {
            return this.size;
        };

        result.setPosition = function()
        {
        };

        var setStrokeFunction = result.setStroke;
        result.setFill = function(color)
        {

        };

        result.setStroke = function(color)
        {

        };
    }
    else
    {
        core.assert(false, "Unsupported figure type:" + type);
    }

    result.setPosition(0, 0);
    return result;
};


mindplot.Topic.prototype.setCursor = function(type)
{
    var innerShape = this.getInnerShape();
    innerShape.setCursor(type);

    var outerShape = this.getOuterShape();
    outerShape.setCursor(type);

    var textShape = this.getTextShape();
    textShape.setCursor(type);
};

mindplot.Topic.OUTER_SHAPE_ATTRIBUTES = {fillColor:'#dbe2e6',stroke:'1 solid #77555a',x:0,y:0};

mindplot.Topic.prototype.getOuterShape = function()
{
    if (!this._outerShape)
    {
        var rect = this.buildShape(mindplot.Topic.OUTER_SHAPE_ATTRIBUTES, mindplot.NodeModel.SHAPE_TYPE_ROUNDED_RECT);
        rect.setPosition(-2, -3);
        rect.setOpacity(0);
        this._outerShape = rect;
    }

    return this._outerShape;
};

mindplot.Topic.prototype.getTextShape = function()
{
    if (!this._text)
    {
        var model = this.getModel();
        this._text = this._buildTextShape();

        // Set Text ...
        var text = this.getText();
        this._setText(text, false);
    }
    return this._text;
};

mindplot.Topic.prototype.getOrBuildIconGroup = function()
{
    if (!this._icon)
    {
        this._icon = this._buildIconGroup();
        var group = this.get2DElement();
        group.appendChild(this._icon.getNativeElement());
        this._icon.moveToFront();
    }
    return this._icon;
};

mindplot.Topic.prototype.getIconGroup = function()
{
    return this._icon;
};

mindplot.Topic.prototype._buildIconGroup = function(disableEventsListeners)
{
    var result = new mindplot.IconGroup(this);
    var model = this.getModel();

    //Icons
    var icons = model.getIcons();
    for(var i=0;i<icons.length;i++)
    {
        // Update model identifier ...
        var iconModel = icons[i];
        var icon = new mindplot.ImageIcon(iconModel, this, designer);
        result.addIcon(icon);
    }

    //Links
    var links = model.getLinks();
    for(var i=0;i<links.length;i++)
    {
        this._hasLink=true;
        this._link = new mindplot.LinkIcon(links[i], this, designer);
        result.addIcon(this._link);
    }

    //Notes
    var notes = model.getNotes();
    for(var i=0;i<notes.length;i++)
    {
        this._hasNote=true;
        this._note = new mindplot.Note(notes[i], this, designer);
        result.addIcon(this._note);
    }

    return result;
};

mindplot.Topic.prototype.addLink = function(url, designer){
    var iconGroup = this.getOrBuildIconGroup();
    var model = this.getModel();
    var linkModel = model.createLink(url);
    model.addLink(linkModel);
    this._link = new mindplot.LinkIcon(linkModel, this, designer);
    iconGroup.addIcon(this._link);
    this._hasLink=true;
};

mindplot.Topic.prototype.addNote = function(text, designer){
    var iconGroup = this.getOrBuildIconGroup();
    var model = this.getModel();
    text = escape(text);
    var noteModel = model.createNote(text)
    model.addNote(noteModel);
    this._note = new mindplot.Note(noteModel, this, designer);
    iconGroup.addIcon(this._note);
    this._hasNote=true;
};

mindplot.Topic.prototype.addIcon = function(iconType, designer){
    var iconGroup = this.getOrBuildIconGroup();
    var model = this.getModel();

    // Update model ...
    var iconModel = model.createIcon(iconType);
    model.addIcon(iconModel);

    var imageIcon = new mindplot.ImageIcon(iconModel, this, designer);
    iconGroup.addIcon(imageIcon);

    return imageIcon;
};

mindplot.Topic.prototype.removeIcon = function(iconModel){

    //Removing the icon from MODEL
    var model = this.getModel();
    model._removeIcon(iconModel);

    //Removing the icon from UI
    var iconGroup = this.getIconGroup();
    if($chk(iconGroup))
    {
        var imgIcon = iconGroup.findIconFromModel(iconModel);
        iconGroup.removeImageIcon(imgIcon);
        if(iconGroup.getIcons().length==0){
            this.get2DElement().removeChild(iconGroup.getNativeElement());
            this._icon=null;
        }
        this.updateNode();
    }
};

mindplot.Topic.prototype.removeLink = function(){
    var model = this.getModel();
    var links = model.getLinks();
    model._removeLink(links[0]);
    var iconGroup = this.getIconGroup();
    if($chk(iconGroup))
    {
        iconGroup.removeIcon(mindplot.LinkIcon.IMAGE_URL);
        if(iconGroup.getIcons().length==0){
            this.get2DElement().removeChild(iconGroup.getNativeElement());
            this._icon=null;
        }
        this.updateNode.delay(0,this);
    }
    this._link=null;
    this._hasLink=false;
}

mindplot.Topic.prototype.removeNote = function(){
    var model = this.getModel();
    var notes = model.getNotes();
    model._removeNote(notes[0]);
    var iconGroup = this.getIconGroup();
    if($chk(iconGroup))
    {
        iconGroup.removeIcon(mindplot.Note.IMAGE_URL);
        if(iconGroup.getIcons().length==0){
            this.get2DElement().removeChild(iconGroup.getNativeElement());
            this._icon=null;
        }
    }
    var elem = this;
    var executor = function(editor)
    {
        return function()
        {
            elem.updateNode();
        };
    };

    setTimeout(executor(this), 0);
    this._note=null;
    this._hasNote=false;
}

mindplot.Topic.prototype._buildTextShape = function(disableEventsListeners)
{
    var result = new web2d.Text();
    var font = {};

    var family = this.getFontFamily();
    var size = this.getFontSize();
    var weight = this.getFontWeight();
    var style = this.getFontStyle();
    result.setFont(family, size, style, weight);

    var color = this.getFontColor();
    result.setColor(color);

    if (!disableEventsListeners)
    {
        // Propagate mouse events ...
        var topic = this;
        result.addEventListener('mousedown', function(event)
        {
            var eventDispatcher = topic.getInnerShape()._dispatcherByEventType['mousedown'];
            if (eventDispatcher)
            {
                eventDispatcher.eventListener(event);
            }
        });

        if (this.getType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
        {
            result.setCursor('move');
        } else
        {
            result.setCursor('default');
        }
    }

    // Positionate node ...
    this._offset = this.getOffset();
    var iconOffset = this.getIconOffset();
    result.setPosition(iconOffset + this._offset, this._offset / 2);
    return result;
};

mindplot.Topic.prototype.getIconOffset = function(){
    var iconGroup = this.getIconGroup();
    var size = 0;
    if($chk(iconGroup))
    {
        size = iconGroup.getSize().width;
    }
    return size;
};

mindplot.Topic.prototype.getOffset = function(value, updateModel)
{
    var offset = 18;

    if (mindplot.NodeModel.MAIN_TOPIC_TYPE == this.getType())
    {
        var parent = this.getModel().getParent();
        if (parent && mindplot.NodeModel.MAIN_TOPIC_TYPE == parent.getType())
        {
            offset = 6;
        }
        else
        {
            offset = 8;
        }
    }
    return offset;
};

mindplot.Topic.prototype.setFontFamily = function(value, updateModel)
{
    var textShape = this.getTextShape();
    textShape.setFontFamily(value);
    if (updateModel)
    {
        var model = this.getModel();
        model.setFontFamily(value);
    }
    var elem = this;
    var executor = function(editor)
    {
        return function()
        {
            elem.updateNode();
        };
    };

    setTimeout(executor(this), 0);
};

mindplot.Topic.prototype.setFontSize = function(value, updateModel)
{
    var textShape = this.getTextShape();
    textShape.setSize(value);
    if (updateModel)
    {
        var model = this.getModel();
        model.setFontSize(value);
    }
    var elem = this;
    var executor = function(editor)
    {
        return function()
        {
            elem.updateNode();
        };
    };

    setTimeout(executor(this), 0);

};

mindplot.Topic.prototype.setFontStyle = function(value, updateModel)
{
    var textShape = this.getTextShape();
    textShape.setStyle(value);
    if (updateModel)
    {
        var model = this.getModel();
        model.setFontStyle(value);
    }
    var elem = this;
    var executor = function(editor)
    {
        return function()
        {
            elem.updateNode();
        };
    };

    setTimeout(executor(this), 0);
};

mindplot.Topic.prototype.setFontWeight = function(value, updateModel)
{
    var textShape = this.getTextShape();
    textShape.setWeight(value);
    if (updateModel)
    {
        var model = this.getModel();
        model.setFontWeight(value);
    }
};

mindplot.Topic.prototype.getFontWeight = function()
{
    var model = this.getModel();
    var result = model.getFontWeight();
    if (!result)
    {
        var font = this._defaultFontStyle();
        result = font.weight;
    }
    return result;
};

mindplot.Topic.prototype.getFontFamily = function()
{
    var model = this.getModel();
    var result = model.getFontFamily();
    if (!result)
    {
        var font = this._defaultFontStyle();
        result = font.font;
    }
    return result;
};

mindplot.Topic.prototype.getFontColor = function()
{
    var model = this.getModel();
    var result = model.getFontColor();
    if (!result)
    {
        var font = this._defaultFontStyle();
        result = font.color;
    }
    return result;
};

mindplot.Topic.prototype.getFontStyle = function()
{
    var model = this.getModel();
    var result = model.getFontStyle();
    if (!result)
    {
        var font = this._defaultFontStyle();
        result = font.style;
    }
    return result;
};

mindplot.Topic.prototype.getFontSize = function()
{
    var model = this.getModel();
    var result = model.getFontSize();
    if (!result)
    {
        var font = this._defaultFontStyle();
        result = font.size;
    }
    return result;
};

mindplot.Topic.prototype.setFontColor = function(value, updateModel)
{
    var textShape = this.getTextShape();
    textShape.setColor(value);
    if (updateModel)
    {
        var model = this.getModel();
        model.setFontColor(value);
    }
};

mindplot.Topic.prototype._setText = function(text, updateModel)
{
    var textShape = this.getTextShape();
    textShape.setText(text);
    var elem = this;
    var executor = function(editor)
    {
        return function()
        {
            elem.updateNode();
        };
    };

    setTimeout(executor(this), 0);

    if (updateModel)
    {
        var model = this.getModel();
        model.setText(text);
    }
};

mindplot.Topic.prototype.setText = function(text)
{
    this._setText(text, true);
};

mindplot.Topic.prototype.getText = function()
{
    var model = this.getModel();
    var result = model.getText();
    if (!result)
    {
        result = this._defaultText();
    }
    return result;
};

mindplot.Topic.prototype.setBackgroundColor = function(color)
{
    this._setBackgroundColor(color, true);
};

mindplot.Topic.prototype._setBackgroundColor = function(color, updateModel)
{
    var innerShape = this.getInnerShape();
    innerShape.setFill(color);

    var connector = this.getShrinkConnector();
    connector.setFill(color);
    if (updateModel)
    {
        var model = this.getModel();
        model.setBackgroundColor(color);
    }
};

mindplot.Topic.prototype.getBackgroundColor = function()
{
    var model = this.getModel();
    var result = model.getBackgroundColor();
    if (!result)
    {
        result = this._defaultBackgroundColor();
    }
    return result;
};

mindplot.Topic.prototype.setBorderColor = function(color)
{
    this._setBorderColor(color, true);
};

mindplot.Topic.prototype._setBorderColor = function(color, updateModel)
{
    var innerShape = this.getInnerShape();
    innerShape.setAttribute('strokeColor', color);

    var connector = this.getShrinkConnector();
    connector.setAttribute('strokeColor', color);


    if (updateModel)
    {
        var model = this.getModel();
        model.setBorderColor(color);
    }
};

mindplot.Topic.prototype.getBorderColor = function()
{
    var model = this.getModel();
    var result = model.getBorderColor();
    if (!result)
    {
        result = this._defaultBorderColor();
    }
    return result;
};

mindplot.Topic.prototype._buildShape = function()
{
    var groupAttributes = {width: 100, height:100,coordSizeWidth:100,coordSizeHeight:100};
    var group = new web2d.Group(groupAttributes);
    this._set2DElement(group);

    // Shape must be build based on the model width ...
    var outerShape = this.getOuterShape();
    var innerShape = this.getInnerShape();
    var textShape = this.getTextShape();
    var shrinkConnector = this.getShrinkConnector();

    // Update figure size ...
    var model = this.getModel();
    var size = model.getSize();
    this._setSize(size);

    // Add to the group ...
    group.appendChild(outerShape);
    group.appendChild(innerShape);
    group.appendChild(textShape);

    if(model.getLinks().length!=0 || model.getNotes().length!=0 || model.getIcons().length!=0)
    {
        iconGroup = this.getOrBuildIconGroup();
    }

    if (this.getType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
    {
        shrinkConnector.addToWorkspace(group);
    }

    // Register listeners ...
    this._registerDefaultListenersToElement(outerShape, this);
    this._registerDefaultListenersToElement(innerShape, this);
    this._registerDefaultListenersToElement(textShape, this);

};

mindplot.Topic.prototype._registerDefaultListenersToElement=function(elem, topic)
{
    var mouseOver = function(event)
    {
        if (topic.isMouseEventsEnabled())
        {
            topic.handleMouseOver(event);
        }
    };
    elem.addEventListener('mouseover', mouseOver);

    var outout = function(event)
    {
        if (topic.isMouseEventsEnabled())
        {
            topic.handleMouseOut(event);
        }
    };
    elem.addEventListener('mouseout', outout);

    // Focus events ...
    var mouseDown = function(event)
    {
        topic.setOnFocus(true);
    };
    elem.addEventListener('mousedown', mouseDown);
};

mindplot.Topic.prototype.areChildrenShrinked = function()
{
    var model = this.getModel();
    return model.areChildrenShrinked();
};

mindplot.Topic.prototype.isCollapsed = function()
{
    var model = this.getModel();
    var result = false;

    var current = this.getParent();
    while(current && !result)
    {
        result = current.areChildrenShrinked();
        current = current.getParent();
    }
    return result;
};

mindplot.Topic.prototype.setChildrenShrinked = function(value)
{
    // Update Model ...
    var model = this.getModel();
    model.setChildrenShrinked(value);

    // Change render base on the state.
    var shrinkConnector = this.getShrinkConnector();
    shrinkConnector.changeRender(value);

    //  Hide branch in order to avoid flickering...
    this._setChildrenVisibility(false);

    // Update topic position based on the state ...
    var targetTopicBoard = this.getTopicBoard();
    targetTopicBoard.repositionate();

    // Hide children ...
    this._setChildrenVisibility(!value);
};

mindplot.Topic.prototype.getShrinkConnector = function()
{
    var result = this._connector;
    if (this._connector == null)
    {
        this._connector = new mindplot.ShirinkConnector(this);
        this._connector.setVisibility(false);
        result = this._connector;

    }
    return result;
};

mindplot.Topic.prototype.handleMouseOver = function(event)
{
    var outerShape = this.getOuterShape();
    outerShape.setOpacity(1);
};

mindplot.Topic.prototype.handleMouseOut = function(event)
{
    var outerShape = this.getOuterShape();
    if (!this.isOnFocus())
    {
        outerShape.setOpacity(0);
    }
};

/**
 * Point: references the center of the rect shape.!!!
 */
mindplot.Topic.prototype.setPosition = function(point)
{
    // Elements are positioned in the center.
    // All topic element must be positioned based on the innerShape.
    var size = this.getSize();

    var cx = Math.round(point.x - (size.width / 2));
    var cy = Math.round(point.y - (size.height / 2));

    // Update visual position.
    this._elem2d.setPosition(cx, cy);

    // Update model's position ...
    var model = this.getModel();
    model.setPosition(point.x, point.y);

    // Update connection lines ...
    this._updateConnectionLines();

    // Check object state.
    this.invariant();
};

mindplot.Topic.CONNECTOR_WIDTH = 6;

mindplot.Topic.prototype.getOutgoingLine = function()
{
    return this._outgoingLine;
};

mindplot.Topic.prototype.getIncomingLines = function()
{
    var result = [];
    var children = this._getChildren();
    for (var i = 0; i < children.length; i++)
    {
        var node = children[i];
        var line = node.getOutgoingLine();
        if (line)
        {
            result.push(line);
        }
    }
    return result;
};

mindplot.Topic.prototype.getOutgoingConnectedTopic = function()
{
    var result = null;
    var line = this.getOutgoingLine();
    if (line)
    {
        result = line.getTargetTopic();
    }
    return result;
};


mindplot.Topic.prototype._updateConnectionLines = function()
{
    // Update this to parent line ...
    var outgoingLine = this.getOutgoingLine();
    if (outgoingLine)
    {
        outgoingLine.redraw();
    }

    // Update all the incoming lines ...
    var incomingLines = this.getIncomingLines();
    for (var i = 0; i < incomingLines.length; i++)
    {
        incomingLines[i].redraw();
    }
};

mindplot.Topic.prototype.setBranchVisibility = function(value)
{
    var current = this;
    var parent = this;
    while (parent != null && parent.getType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
    {
        current = parent;
        parent = current.getParent();
    }
    current.setVisibility(value);
};


mindplot.Topic.prototype.setVisibility = function(value)
{
    this._setTopicVisibility(value);

    // Hide all children...
    this._setChildrenVisibility(value);
};

mindplot.Topic.prototype._setTopicVisibility = function(value)
{
    var elem = this.get2DElement();
    elem.setVisibility(value);

    if (this.getIncomingLines().length > 0)
    {
        var connector = this.getShrinkConnector();
        connector.setVisibility(value);
    }

    var textShape = this.getTextShape();
    textShape.setVisibility(value);

};

mindplot.Topic.prototype._setChildrenVisibility = function(isVisible)
{

    // Hide all children.
    var children = this._getChildren();
    var model = this.getModel();

    isVisible = isVisible ? !model.areChildrenShrinked() : isVisible;
    for (var i = 0; i < children.length; i++)
    {
        var child = children[i];
        child._setChildrenVisibility(isVisible);

        child._setTopicVisibility(isVisible);

        var outgoingLine = child.getOutgoingLine();
        outgoingLine.setVisibility(isVisible);
    }

}

mindplot.Topic.prototype.invariant = function()
{
    var line = this._outgoingLine;
    var model = this.getModel();
    var isConnected = model.isConnected();

    // Check consitency...
    if ((isConnected && !line) || (!isConnected && line))
    {
        // core.assert(false,'Illegal state exception.');
    }
};

/**
 * type:
 *    onfocus
 */
mindplot.Topic.prototype.addEventListener = function(type, listener)
{
    // Translate to web 2d events ...
    if (type == 'onfocus')
    {
        type = 'mousedown';
    }

    var textShape = this.getTextShape();
    textShape.addEventListener(type, listener);

    var outerShape = this.getOuterShape();
    outerShape.addEventListener(type, listener);

    var innerShape = this.getInnerShape();
    innerShape.addEventListener(type, listener);
};


mindplot.Topic.prototype._setSize = function(size)
{
    core.assert(size, "size can not be null");
    core.assert(core.Utils.isDefined(size.width), "size seem not to be a valid element");

    mindplot.Topic.superClass.setSize.call(this, size);

    var outerShape = this.getOuterShape();
    var innerShape = this.getInnerShape();
    var connector = this.getShrinkConnector();

    outerShape.setSize(size.width + 4, size.height + 6);
    innerShape.setSize(size.width, size.height);
};

mindplot.Topic.prototype.setSize = function(size, force)
{
    var oldSize = this.getSize();
    if (oldSize.width != size.width || oldSize.height != size.height || force)
    {
        this._setSize(size);

        // Update the figure position(ej: central topic must be centered) and children position.
        this._updatePositionOnChangeSize(oldSize, size);
    }
};

mindplot.Topic.prototype._updatePositionOnChangeSize = function(oldSize, newSize) {
    core.assert(false, "this method must be overided");
};

mindplot.Topic.prototype.disconnect = function(workspace)
{
    var outgoingLine = this.getOutgoingLine();
    if (outgoingLine)
    {
        core.assert(workspace, 'workspace can not be null');

        this._outgoingLine = null;

        // Disconnect nodes ...
        var targetTopic = outgoingLine.getTargetTopic();
        targetTopic._removeChild(this);

        // Update model ...
        var childModel = this.getModel();
        childModel.disconnect();

        // Remove graphical element from the workspace...
        outgoingLine.removeFromWorkspace(workspace);

        // Remove from workspace.
        var topicBoard = targetTopic.getTopicBoard();
        topicBoard.removeTopicFromBoard(this);

        // Change text based on the current connection ...
        var model = this.getModel();
        if (!model.getText())
        {
            var text = this.getText();
            this._setText(text, false);
        }
        if (!model.getFontSize())
        {
            var size = this.getFontSize();
            this.setFontSize(size, false);
        }

        // Hide connection line?.
        if (targetTopic._getChildren().length == 0)
        {
            var connector = targetTopic.getShrinkConnector();
            connector.setVisibility(false);
        }

    }
};

mindplot.Topic.prototype.getOrder = function()
{
    var model = this.getModel();
    return model.getOrder();
};

mindplot.Topic.prototype.moveToFront = function()
{
    var elem2d = this.get2DElement();
    elem2d.moveToFront();
};
mindplot.Topic.prototype.setOrder = function(value)
{
    var model = this.getModel();
    model.setOrder(value);
};

mindplot.Topic.prototype.connectTo = function(targetTopic, workspace)
{
    core.assert(!this._outgoingLine, 'Could not connect an already connected node');
    core.assert(targetTopic != this, 'Cilcular connection are not allowed');
    core.assert(targetTopic, 'Parent Graph can not be null');
    core.assert(workspace, 'Workspace can not be null');

    // Create a connection line ...
    var outgoingLine = new mindplot.ConnectionLine(this, targetTopic);
    this._outgoingLine = outgoingLine;
    workspace.appendChild(outgoingLine);

    // Connect Graphical Nodes ...
    targetTopic._appendChild(this);
    this._parent = targetTopic;

    // Update model ...
    var targetModel = targetTopic.getModel();
    var childModel = this.getModel();
    childModel.connectTo(targetModel);

    // Update figure is necessary.
    this.updateTopicShape(targetTopic);

    // Change text based on the current connection ...
    var model = this.getModel();
    if (!model.getText())
    {
        var text = this.getText();
        this._setText(text, false);
    }
    if (!model.getFontSize())
    {
        var size = this.getFontSize();
        this.setFontSize(size, false);
    }
    var textShape = this.getTextShape();

    // Update topic position based on the state ...
    var targetTopicBoard = targetTopic.getTopicBoard();
    targetTopicBoard.addBranch(this);

    // Display connection node...
    var connector = targetTopic.getShrinkConnector();
    connector.setVisibility(true);

    // Redraw line ...
    outgoingLine.redraw();
};

mindplot.Topic.prototype._appendChild = function(child)
{
    var children = this._getChildren();
    children.push(child);
};

mindplot.Topic.prototype._removeChild = function(child)
{
    var children = this._getChildren();
    children.remove(child);
};

mindplot.Topic.prototype._getChildren = function()
{
    var result = this._children;
    if (!result)
    {
        this._children = [];
        result = this._children;
    }
    return result;
};

mindplot.Topic.prototype.removeFromWorkspace = function(workspace)
{
    var elem2d = this.get2DElement();
    workspace.removeChild(elem2d);
    var line = this.getOutgoingLine();
    if (line)
    {
        workspace.removeChild(line);
    }
};

mindplot.Topic.prototype.addToWorkspace = function(workspace)
{
    var elem = this.get2DElement();
    workspace.appendChild(elem);
};

mindplot.Topic.prototype.getTopicBoard = function()
{
    return this._topicBoard;
};

mindplot.Topic.prototype.createDragNode = function()
{
    var dragNode = mindplot.Topic.superClass.createDragNode.call(this);

    // Is the node already connected ?
    var targetTopic = this.getOutgoingConnectedTopic();
    if (targetTopic)
    {
        dragNode.connectTo(targetTopic);
    }
    return dragNode;
};

mindplot.Topic.prototype.updateNode = function()
{
    var textShape = this.getTextShape();
    var sizeWidth = textShape.getWidth();
    var sizeHeight = textShape.getHeight();
    var font = textShape.getFont();
    var iconOffset = this.getIconOffset();

    var newSize = {width:sizeWidth + this._offset*2 + iconOffset,height:sizeHeight + this._offset};
    this.setSize(newSize);

    // Positionate node ...
    textShape.setPosition(iconOffset+this._offset, this._offset / 2);
    textShape.setTextSize(sizeWidth, sizeHeight);
};
