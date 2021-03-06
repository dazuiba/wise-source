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

web2d.peer.svg.ElipsePeer = function()
{
    var svgElement = window.document.createElementNS(this.svgNamespace, 'ellipse');
    web2d.peer.svg.ElementPeer.call(this, svgElement);
    this.attachChangeEventListener("strokeStyle", web2d.peer.svg.ElementPeer.prototype.updateStrokeStyle);
    this._position={x:0, y:0};
};

objects.extend(web2d.peer.svg.ElipsePeer, web2d.peer.svg.ElementPeer);

web2d.peer.svg.ElipsePeer.prototype.setSize = function(width, height)
{
    web2d.peer.svg.ElipsePeer.superClass.setSize.call(this, width, height);
    if (core.Utils.isDefined(width))
    {
        this._native.setAttribute('rx', width / 2);
    }

    if (core.Utils.isDefined(height))
    {
        this._native.setAttribute('ry', height / 2);
    }

    var pos = this.getPosition();
    this.setPosition(pos.x, pos.y);
};

web2d.peer.svg.ElipsePeer.prototype.setPosition = function(cx, cy)
{
    var size =this.getSize();
    cx =cx + size.width/2;
    cy =cy + size.height/2;
    if (core.Utils.isDefined(cx))
    {
        this._native.setAttribute('cx', cx);
    }

    if (core.Utils.isDefined(cy))
    {
        this._native.setAttribute('cy', cy);
    }
};

web2d.peer.svg.ElipsePeer.prototype.getPosition = function()
{
    return this._position;
};

