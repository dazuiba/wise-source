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

mindplot.ImageIcon = function(iconModel, topic, designer) {

    core.assert(iconModel, 'iconModel can not be null');
    core.assert(topic, 'topic can not be null');
    core.assert(designer, 'designer can not be null');
    this._topic = topic;
    this._iconModel = iconModel;
    this._designer = designer;

    // Build graph image representation ...
    var iconType = iconModel.getIconType();
    var imgUrl = this._getImageUrl(iconType);
    mindplot.Icon.call(this, imgUrl);

    //Remove
    var divContainer = designer.getWorkSpace().getScreenManager().getContainer();
    var tip = mindplot.Tip.getInstance(divContainer);

    var container = new Element('div');
    var removeImage = new Element('img');
    removeImage.src = "../images/bin.png";
    removeImage.inject(container);

    if (!designer._viewMode)
    {

        removeImage.addEvent('click', function(event) {
            // @Todo: actionRunner should not be exposed ...
            var actionRunner = designer._actionRunner;
            var command = new mindplot.commands.RemoveIconFromTopicCommand(this._topic.getId(), iconModel);
            actionRunner.execute(command);
            tip.forceClose();
        }.bindWithEvent(this));

        //Icon
        var image = this.getImage();
        image.addEventListener('click', function(event) {
            var iconType = iconModel.getIconType();
            var newIconType = this._getNextFamilyIconId(iconType);
            iconModel.setIconType(newIconType);

            var imgUrl = this._getImageUrl(newIconType);
            this._image.setHref(imgUrl);

            //        // @Todo: Support revert of change icon ...
            //        var actionRunner = designer._actionRunner;
            //        var command = new mindplot.commands.ChangeIconFromTopicCommand(this._topic.getId());
            //        this._actionRunner.execute(command);


        }.bindWithEvent(this));

        var imageIcon = this;
        image.addEventListener('mouseover', function(event) {
            tip.open(event, container, imageIcon);
        });
        image.addEventListener('mouseout', function(event) {
            tip.close(event);
        });
        image.addEventListener('mousemove', function(event) {
            tip.updatePosition(event);
        });

    }
};

objects.extend(mindplot.ImageIcon, mindplot.Icon);

mindplot.ImageIcon.prototype.initialize = function() {

};

mindplot.ImageIcon.prototype._getImageUrl = function(id) {
    return mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[id];
};

mindplot.ImageIcon.prototype.getModel = function() {
    return this._iconModel;
};


mindplot.ImageIcon.prototype._getNextFamilyIconId = function(id) {

    var familyIcons = this._getFamilyIcons(id);
    core.assert(familyIcons != null, "Family Icon not found!");

    var result = null;
    for (var i = 0; i < familyIcons.length && result == null; i++)
    {
        if (familyIcons[i] == id) {
            var nextIconId;
            //Is last one?
            if (i == (familyIcons.length - 1)) {
                result = familyIcons[0];
            } else {
                result = familyIcons[i + 1];
            }
            break;
        }
    }

    return result;
};

mindplot.ImageIcon.prototype._getFamilyIcons = function(id) {
    core.assert(id != null, "id must not be null");
    core.assert(id.indexOf("_") != -1, "Invalid icon id (it must contain '_')");
    var result = null;
    for (var i = 0; i < mindplot.ImageIcon.prototype.ICON_FAMILIES.length; i++)
    {
        var family = mindplot.ImageIcon.prototype.ICON_FAMILIES[i];
        var familyPrefix = id.substr(0, id.indexOf("_"));
        if (family[0].match(familyPrefix) != null) {
            result = family;
            break;
        }
    }
    return result;
};

mindplot.ImageIcon.prototype.getId = function()
{
    return this._iconType;
};

mindplot.ImageIcon.prototype.getUiId = function()
{
    return this._uiId;
};

mindplot.ImageIcon.ICON_FAMILIY_FLAG_PREFIX = 'flag_';
mindplot.ImageIcon.ICON_FAMILIY_BULLET_PREFIX = 'bullet_';
mindplot.ImageIcon.ICON_FAMILIY_TAG_PREFIX = 'tag_';
mindplot.ImageIcon.ICON_FAMILIY_FACE_PREFIX = 'face_';
mindplot.ImageIcon.ICON_FAMILIY_FACE_FUNY_PREFIX = 'facefuny_';
mindplot.ImageIcon.ICON_FAMILIY_ARROW_PREFIX = 'arrow_';
mindplot.ImageIcon.ICON_FAMILIY_ARROWC_PREFIX = 'arrowc_';

mindplot.ImageIcon.ICON_FAMILIY_CHART_PREFIX = 'chart_';
mindplot.ImageIcon.ICON_FAMILIY_ONOFF_PREFIX = 'onoff_';
mindplot.ImageIcon.ICON_FAMILIY_THUMB_PREFIX = 'thumb_';
mindplot.ImageIcon.ICON_FAMILIY_MONEY_PREFIX = 'money_';
mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX = 'number_';
mindplot.ImageIcon.ICON_FAMILIY_TICK_PREFIX = 'tick_';
mindplot.ImageIcon.ICON_FAMILIY_CONNECT_PREFIX = 'conn_';
mindplot.ImageIcon.ICON_FAMILIY_BULB_PREFIX = 'bulb_'
mindplot.ImageIcon.ICON_FAMILIY_TASK_PREFIX = 'task_';

mindplot.ImageIcon.ICON_TYPE_ARROW_UP = mindplot.ImageIcon.ICON_FAMILIY_ARROW_PREFIX + 'up';
mindplot.ImageIcon.ICON_TYPE_ARROW_DOWN = mindplot.ImageIcon.ICON_FAMILIY_ARROW_PREFIX + 'down';
mindplot.ImageIcon.ICON_TYPE_ARROW_LEFT = mindplot.ImageIcon.ICON_FAMILIY_ARROW_PREFIX + 'left';
mindplot.ImageIcon.ICON_TYPE_ARROW_RIGHT = mindplot.ImageIcon.ICON_FAMILIY_ARROW_PREFIX + 'right';

mindplot.ImageIcon.ICON_TYPE_ARROWC_TURN_LEFT = mindplot.ImageIcon.ICON_FAMILIY_ARROWC_PREFIX + 'turn_left';
mindplot.ImageIcon.ICON_TYPE_ARROWC_TURN_RIGHT = mindplot.ImageIcon.ICON_FAMILIY_ARROWC_PREFIX + 'turn_right';
mindplot.ImageIcon.ICON_TYPE_ARROWC_UNDO = mindplot.ImageIcon.ICON_FAMILIY_ARROWC_PREFIX + 'undo';
mindplot.ImageIcon.ICON_TYPE_ARROWC_ANTICLOCKWISE = mindplot.ImageIcon.ICON_FAMILIY_ARROWC_PREFIX + 'rotate_anticlockwise';
mindplot.ImageIcon.ICON_TYPE_ARROWC_CLOCKWISE = mindplot.ImageIcon.ICON_FAMILIY_ARROWC_PREFIX + 'rotate_clockwise';

mindplot.ImageIcon.ICON_TYPE_FACE_PLAIN = mindplot.ImageIcon.ICON_FAMILIY_FACE_PREFIX + 'plain';
mindplot.ImageIcon.ICON_TYPE_FACE_SAD = mindplot.ImageIcon.ICON_FAMILIY_FACE_PREFIX + 'sad';
mindplot.ImageIcon.ICON_TYPE_FACE_SMILE_BIG = mindplot.ImageIcon.ICON_FAMILIY_FACE_PREFIX + 'smilebig';
mindplot.ImageIcon.ICON_TYPE_FACE_SMILE = mindplot.ImageIcon.ICON_FAMILIY_FACE_PREFIX + 'smile';
mindplot.ImageIcon.ICON_TYPE_FACE_SURPRISE = mindplot.ImageIcon.ICON_FAMILIY_FACE_PREFIX + 'surprise';
mindplot.ImageIcon.ICON_TYPE_FACE_WINK = mindplot.ImageIcon.ICON_FAMILIY_FACE_PREFIX + 'wink';
mindplot.ImageIcon.ICON_TYPE_FACE_CRYING = mindplot.ImageIcon.ICON_FAMILIY_FACE_PREFIX + 'crying';

mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_ANGEL = mindplot.ImageIcon.ICON_FAMILIY_FACE_FUNY_PREFIX + 'angel';
mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_DEVIL = mindplot.ImageIcon.ICON_FAMILIY_FACE_FUNY_PREFIX + 'devilish';
mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_GLASSES = mindplot.ImageIcon.ICON_FAMILIY_FACE_FUNY_PREFIX + 'glasses';
mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_GRIN = mindplot.ImageIcon.ICON_FAMILIY_FACE_FUNY_PREFIX + 'grin';
mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_KISS = mindplot.ImageIcon.ICON_FAMILIY_FACE_FUNY_PREFIX + 'kiss';
mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_MONKEY = mindplot.ImageIcon.ICON_FAMILIY_FACE_FUNY_PREFIX + 'monkey';

mindplot.ImageIcon.ICON_TYPE_CHART_BAR = mindplot.ImageIcon.ICON_FAMILIY_CHART_PREFIX + 'bar';
mindplot.ImageIcon.ICON_TYPE_CHART_LINE = mindplot.ImageIcon.ICON_FAMILIY_CHART_PREFIX + 'line';
mindplot.ImageIcon.ICON_TYPE_CHART_CURVE = mindplot.ImageIcon.ICON_FAMILIY_CHART_PREFIX + 'curve';
mindplot.ImageIcon.ICON_TYPE_CHART_PIE = mindplot.ImageIcon.ICON_FAMILIY_CHART_PREFIX + 'pie';
mindplot.ImageIcon.ICON_TYPE_CHART_ORGANISATION = mindplot.ImageIcon.ICON_FAMILIY_CHART_PREFIX + 'organisation';

mindplot.ImageIcon.ICON_TYPE_FLAG_BLUE = mindplot.ImageIcon.ICON_FAMILIY_FLAG_PREFIX + 'blue';
mindplot.ImageIcon.ICON_TYPE_FLAG_GREEN = mindplot.ImageIcon.ICON_FAMILIY_FLAG_PREFIX + 'green';
mindplot.ImageIcon.ICON_TYPE_FLAG_ORANGE = mindplot.ImageIcon.ICON_FAMILIY_FLAG_PREFIX + 'orange';
mindplot.ImageIcon.ICON_TYPE_FLAG_PINK = mindplot.ImageIcon.ICON_FAMILIY_FLAG_PREFIX + 'pink';
mindplot.ImageIcon.ICON_TYPE_FLAG_PURPLE = mindplot.ImageIcon.ICON_FAMILIY_FLAG_PREFIX + 'purple';
mindplot.ImageIcon.ICON_TYPE_FLAG_YELLOW = mindplot.ImageIcon.ICON_FAMILIY_FLAG_PREFIX + 'yellow';

mindplot.ImageIcon.ICON_TYPE_BULLET_BLACK = mindplot.ImageIcon.ICON_FAMILIY_BULLET_PREFIX + 'black';
mindplot.ImageIcon.ICON_TYPE_BULLET_BLUE = mindplot.ImageIcon.ICON_FAMILIY_BULLET_PREFIX + 'blue';
mindplot.ImageIcon.ICON_TYPE_BULLET_GREEN = mindplot.ImageIcon.ICON_FAMILIY_BULLET_PREFIX + 'green';
mindplot.ImageIcon.ICON_TYPE_BULLET_ORANGE = mindplot.ImageIcon.ICON_FAMILIY_BULLET_PREFIX + 'orange';
mindplot.ImageIcon.ICON_TYPE_BULLET_RED = mindplot.ImageIcon.ICON_FAMILIY_BULLET_PREFIX + 'red';
mindplot.ImageIcon.ICON_TYPE_BULLET_PINK = mindplot.ImageIcon.ICON_FAMILIY_BULLET_PREFIX + 'pink';
mindplot.ImageIcon.ICON_TYPE_BULLET_PURPLE = mindplot.ImageIcon.ICON_FAMILIY_BULLET_PREFIX + 'purple';

mindplot.ImageIcon.ICON_TYPE_TAG_BLUE = mindplot.ImageIcon.ICON_FAMILIY_TAG_PREFIX + 'blue';
mindplot.ImageIcon.ICON_TYPE_TAG_GREEN = mindplot.ImageIcon.ICON_FAMILIY_TAG_PREFIX + 'green';
mindplot.ImageIcon.ICON_TYPE_TAG_ORANGE = mindplot.ImageIcon.ICON_FAMILIY_TAG_PREFIX + 'orange';
mindplot.ImageIcon.ICON_TYPE_TAG_RED = mindplot.ImageIcon.ICON_FAMILIY_TAG_PREFIX + 'red';
mindplot.ImageIcon.ICON_TYPE_TAG_PINK = mindplot.ImageIcon.ICON_FAMILIY_TAG_PREFIX + 'pink';
mindplot.ImageIcon.ICON_TYPE_TAG_YELLOW = mindplot.ImageIcon.ICON_FAMILIY_TAG_PREFIX + 'yellow';
mindplot.ImageIcon.ICON_TYPE_TAG_PURPLE = mindplot.ImageIcon.ICON_FAMILIY_TAG_PREFIX + 'purple';

mindplot.ImageIcon.ICON_TYPE_ONOFF_THUMB_UP = mindplot.ImageIcon.ICON_FAMILIY_THUMB_PREFIX + 'thumb_up';
mindplot.ImageIcon.ICON_TYPE_ONOFF_THUMB_DOWN = mindplot.ImageIcon.ICON_FAMILIY_THUMB_PREFIX + 'thumb_down';

mindplot.ImageIcon.ICON_TYPE_TICK_ON = mindplot.ImageIcon.ICON_FAMILIY_TICK_PREFIX + 'tick';
mindplot.ImageIcon.ICON_TYPE_TICK_OFF = mindplot.ImageIcon.ICON_FAMILIY_TICK_PREFIX + 'cross';

mindplot.ImageIcon.ICON_TYPE_BULB_ON = mindplot.ImageIcon.ICON_FAMILIY_BULB_PREFIX + 'light_on';
mindplot.ImageIcon.ICON_TYPE_BULB_OFF = mindplot.ImageIcon.ICON_FAMILIY_BULB_PREFIX + 'light_off';

mindplot.ImageIcon.ICON_TYPE_CONNECT_ON = mindplot.ImageIcon.ICON_FAMILIY_CONNECT_PREFIX + 'connect';
mindplot.ImageIcon.ICON_TYPE_CONNECT_OFF = mindplot.ImageIcon.ICON_FAMILIY_CONNECT_PREFIX + 'disconnect';

mindplot.ImageIcon.ICON_TYPE_ONOFF_CLOCK = mindplot.ImageIcon.ICON_FAMILIY_ONOFF_PREFIX + 'clock';
mindplot.ImageIcon.ICON_TYPE_ONOFF_CLOCK_RED = mindplot.ImageIcon.ICON_FAMILIY_ONOFF_PREFIX + 'clock_red';
mindplot.ImageIcon.ICON_TYPE_ONOFF_ADD = mindplot.ImageIcon.ICON_FAMILIY_ONOFF_PREFIX + 'add';
mindplot.ImageIcon.ICON_TYPE_ONOFF_DELETE = mindplot.ImageIcon.ICON_FAMILIY_ONOFF_PREFIX + 'delete';

mindplot.ImageIcon.ICON_TYPE_MONEY_MONEY = mindplot.ImageIcon.ICON_FAMILIY_MONEY_PREFIX + 'money';
mindplot.ImageIcon.ICON_TYPE_MONEY_DOLLAR = mindplot.ImageIcon.ICON_FAMILIY_MONEY_PREFIX + 'dollar';
mindplot.ImageIcon.ICON_TYPE_MONEY_EURO = mindplot.ImageIcon.ICON_FAMILIY_MONEY_PREFIX + 'euro';
mindplot.ImageIcon.ICON_TYPE_MONEY_POUND = mindplot.ImageIcon.ICON_FAMILIY_MONEY_PREFIX + 'pound';
mindplot.ImageIcon.ICON_TYPE_MONEY_YEN = mindplot.ImageIcon.ICON_FAMILIY_MONEY_PREFIX + 'yen';
mindplot.ImageIcon.ICON_TYPE_MONEY_COINS = mindplot.ImageIcon.ICON_FAMILIY_MONEY_PREFIX + 'coins';
mindplot.ImageIcon.ICON_TYPE_MONEY_RUBY = mindplot.ImageIcon.ICON_FAMILIY_MONEY_PREFIX + 'ruby';

mindplot.ImageIcon.ICON_TYPE_NUMBER_ONE = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'one';
mindplot.ImageIcon.ICON_TYPE_NUMBER_TWO = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'two';
mindplot.ImageIcon.ICON_TYPE_NUMBER_THREE = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'three';
mindplot.ImageIcon.ICON_TYPE_NUMBER_FOUR = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'four';
mindplot.ImageIcon.ICON_TYPE_NUMBER_FIVE = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'five';
mindplot.ImageIcon.ICON_TYPE_NUMBER_SIX = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'six';
mindplot.ImageIcon.ICON_TYPE_NUMBER_SEVEN = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'seven';
mindplot.ImageIcon.ICON_TYPE_NUMBER_EIGHT = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'eight';
mindplot.ImageIcon.ICON_TYPE_NUMBER_NINE = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'nine';

mindplot.ImageIcon.ICON_TYPE_TASK_ONE = mindplot.ImageIcon.ICON_FAMILIY_TASK_PREFIX + 'one';
mindplot.ImageIcon.ICON_TYPE_TASK_TWO = mindplot.ImageIcon.ICON_FAMILIY_TASK_PREFIX + 'two';
mindplot.ImageIcon.ICON_TYPE_TASK_THREE = mindplot.ImageIcon.ICON_FAMILIY_TASK_PREFIX + 'three';
mindplot.ImageIcon.ICON_TYPE_TASK_FOUR = mindplot.ImageIcon.ICON_FAMILIY_TASK_PREFIX + 'four';
mindplot.ImageIcon.ICON_TYPE_TASK_FIVE = mindplot.ImageIcon.ICON_FAMILIY_TASK_PREFIX + 'five';


mindplot.ImageIcon.prototype.ICON_IMAGE_MAP = new Object();
//FLAG
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FLAG_BLUE] = "../images/flag_blue.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FLAG_GREEN] = "../images/flag_green.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FLAG_ORANGE] = "../images/flag_orange.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FLAG_PINK] = "../images/flag_pink.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FLAG_PURPLE] = "../images/flag_purple.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FLAG_YELLOW] = "../images/flag_yellow.png";
//BULLET
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULLET_BLACK] = "../images/bullet_black.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULLET_BLUE] = "../images/bullet_blue.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULLET_GREEN] = "../images/bullet_blue.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULLET_ORANGE] = "../images/bullet_green.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULLET_RED] = "../images/bullet_orange.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULLET_PINK] = "../images/bullet_pink.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULLET_PURPLE] = "../images/bullet_purple.png";
//TAGS
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TAG_BLUE] = "../images/tag_blue.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TAG_GREEN] = "../images/tag_green.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TAG_ORANGE] = "../images/tag_orange.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TAG_RED] = "../images/tag_red.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TAG_PINK] = "../images/tag_pink.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TAG_YELLOW] = "../images/tag_yellow.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TAG_PURPLE] = "../images/tag_purple.png";
//FACES
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_ANGEL] = "../images/face-angel.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_DEVIL] = "../images/face-devilish.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_GLASSES] = "../images/face-glasses.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_KISS] = "../images/face-kiss.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_MONKEY] = "../images/face-monkey.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_PLAIN] = "../images/face-plain.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_CRYING] = "../images/face-crying.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_SAD] = "../images/face-sad.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_SMILE] = "../images/face-smile.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_SURPRISE] = "../images/face-surprise.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_WINK] = "../images/face-wink.png";

//ARROWS
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROW_UP] = "../images/arrow_up.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROW_DOWN] = "../images/arrow_down.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROW_LEFT] = "../images/arrow_left.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROW_RIGHT] = "../images/arrow_right.png";

// ARROWS COMPLEX.
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROWC_TURN_LEFT] = "../images/arrow_turn_left.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROWC_TURN_RIGHT] = "../images/arrow_turn_right.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROWC_UNDO] = "../images/arrow_undo.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROWC_ANTICLOCKWISE] = "../images/arrow_rotate_anticlockwise.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROWC_CLOCKWISE] = "../images/arrow_rotate_clockwise.png";

//CHARTS
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_CHART_BAR] = "../images/chart_bar.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_CHART_LINE] = "../images/chart_line.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_CHART_CURVE] = "../images/chart_curve.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_CHART_PIE] = "../images/chart_pie.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_CHART_ORGANISATION] = "../images/chart_organisation.png";

// THUMB
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ONOFF_THUMB_UP] = "../images/thumb_up.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ONOFF_THUMB_DOWN] = "../images/thumb_down.png";

// ON OFF
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TICK_ON] = "../images/tick.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TICK_OFF] = "../images/cross.png";

mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULB_ON] = "../images/lightbulb.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULB_OFF] = "../images/lightbulb_off.png";

mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_CONNECT_ON] = "../images/connect.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_CONNECT_OFF] = "../images/disconnect.png";

mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ONOFF_CLOCK] = "../images/clock.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ONOFF_CLOCK_RED] = "../images/clock_red.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ONOFF_ADD] = "../images/add.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ONOFF_DELETE] = "../images/delete.png";
//MONEY
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_MONEY_MONEY] = "../images/money.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_MONEY_DOLLAR] = "../images/money_dollar.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_MONEY_EURO] = "../images/money_euro.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_MONEY_POUND] = "../images/money_pound.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_MONEY_YEN] = "../images/money_yen.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_MONEY_COINS] = "../images/coins.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_MONEY_RUBY] = "../images/ruby.png";


//FAMILIES
mindplot.ImageIcon.prototype.ICON_FLAG_FAMILY = [mindplot.ImageIcon.ICON_TYPE_FLAG_BLUE, mindplot.ImageIcon.ICON_TYPE_FLAG_GREEN,mindplot.ImageIcon.ICON_TYPE_FLAG_ORANGE,mindplot.ImageIcon.ICON_TYPE_FLAG_PINK, mindplot.ImageIcon.ICON_TYPE_FLAG_PURPLE, mindplot.ImageIcon.ICON_TYPE_FLAG_YELLOW];
mindplot.ImageIcon.prototype.ICON_TAG_FAMILY = [mindplot.ImageIcon.ICON_TYPE_TAG_BLUE, mindplot.ImageIcon.ICON_TYPE_TAG_GREEN,mindplot.ImageIcon.ICON_TYPE_TAG_ORANGE,mindplot.ImageIcon.ICON_TYPE_TAG_PINK, mindplot.ImageIcon.ICON_TYPE_TAG_PURPLE, mindplot.ImageIcon.ICON_TYPE_TAG_YELLOW];
mindplot.ImageIcon.prototype.ICON_BULLET_FAMILY = [mindplot.ImageIcon.ICON_TYPE_BULLET_BLACK, mindplot.ImageIcon.ICON_TYPE_BULLET_BLUE, mindplot.ImageIcon.ICON_TYPE_BULLET_GREEN,mindplot.ImageIcon.ICON_TYPE_BULLET_ORANGE,mindplot.ImageIcon.ICON_TYPE_BULLET_RED, mindplot.ImageIcon.ICON_TYPE_BULLET_PINK, mindplot.ImageIcon.ICON_TYPE_BULLET_PURPLE];
mindplot.ImageIcon.prototype.ICON_FUNY_FACE_FAMILY = [mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_ANGEL, mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_DEVIL, mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_GLASSES, mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_KISS, mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_MONKEY];
mindplot.ImageIcon.prototype.ICON_FACE_FAMILY = [mindplot.ImageIcon.ICON_TYPE_FACE_PLAIN, mindplot.ImageIcon.ICON_TYPE_FACE_SAD, mindplot.ImageIcon.ICON_TYPE_FACE_CRYING, mindplot.ImageIcon.ICON_TYPE_FACE_SMILE, mindplot.ImageIcon.ICON_TYPE_FACE_SURPRISE, mindplot.ImageIcon.ICON_TYPE_FACE_WINK];
mindplot.ImageIcon.prototype.ICON_ARROW_FAMILY = [mindplot.ImageIcon.ICON_TYPE_ARROW_UP, mindplot.ImageIcon.ICON_TYPE_ARROW_DOWN, mindplot.ImageIcon.ICON_TYPE_ARROW_LEFT, mindplot.ImageIcon.ICON_TYPE_ARROW_RIGHT];
mindplot.ImageIcon.prototype.ICON_COMPLEX_ARROW_FAMILY = [mindplot.ImageIcon.ICON_TYPE_ARROWC_UNDO, mindplot.ImageIcon.ICON_TYPE_ARROWC_ANTICLOCKWISE, mindplot.ImageIcon.ICON_TYPE_ARROWC_CLOCKWISE,mindplot.ImageIcon.ICON_TYPE_ARROWC_TURN_LEFT, mindplot.ImageIcon.ICON_TYPE_ARROWC_TURN_RIGHT];
mindplot.ImageIcon.prototype.ICON_CHART_FAMILY = [mindplot.ImageIcon.ICON_TYPE_CHART_BAR, mindplot.ImageIcon.ICON_TYPE_CHART_LINE, mindplot.ImageIcon.ICON_TYPE_CHART_CURVE, mindplot.ImageIcon.ICON_TYPE_CHART_PIE, mindplot.ImageIcon.ICON_TYPE_CHART_ORGANISATION];
mindplot.ImageIcon.prototype.ICON_TICK_FAMILY = [ mindplot.ImageIcon.ICON_TYPE_TICK_ON, mindplot.ImageIcon.ICON_TYPE_TICK_OFF];

mindplot.ImageIcon.prototype.ICON_CONNECT_FAMILY = [ mindplot.ImageIcon.ICON_TYPE_CONNECT_ON, mindplot.ImageIcon.ICON_TYPE_CONNECT_OFF];
mindplot.ImageIcon.prototype.ICON_BULB_FAMILY = [ mindplot.ImageIcon.ICON_TYPE_BULB_ON, mindplot.ImageIcon.ICON_TYPE_BULB_OFF];
mindplot.ImageIcon.prototype.ICON_ONOFF_FAMILY = [ mindplot.ImageIcon.ICON_TYPE_ONOFF_CLOCK, mindplot.ImageIcon.ICON_TYPE_ONOFF_CLOCK_RED, mindplot.ImageIcon.ICON_TYPE_ONOFF_ADD, mindplot.ImageIcon.ICON_TYPE_ONOFF_DELETE];

mindplot.ImageIcon.prototype.ICON_THUMB_FAMILY = [mindplot.ImageIcon.ICON_TYPE_ONOFF_THUMB_UP, mindplot.ImageIcon.ICON_TYPE_ONOFF_THUMB_DOWN];
mindplot.ImageIcon.prototype.ICON_MONEY_FAMILY = [mindplot.ImageIcon.ICON_TYPE_MONEY_MONEY,mindplot.ImageIcon.ICON_TYPE_MONEY_DOLLAR,mindplot.ImageIcon.ICON_TYPE_MONEY_EURO,mindplot.ImageIcon.ICON_TYPE_MONEY_POUND,mindplot.ImageIcon.ICON_TYPE_MONEY_YEN,mindplot.ImageIcon.ICON_TYPE_MONEY_COINS,mindplot.ImageIcon.ICON_TYPE_MONEY_RUBY];


mindplot.ImageIcon.prototype.ICON_FAMILIES = [mindplot.ImageIcon.prototype.ICON_FACE_FAMILY, mindplot.ImageIcon.prototype.ICON_FUNY_FACE_FAMILY,mindplot.ImageIcon.prototype.ICON_ARROW_FAMILY,mindplot.ImageIcon.prototype.ICON_COMPLEX_ARROW_FAMILY,  mindplot.ImageIcon.prototype.ICON_CONNECT_FAMILY,mindplot.ImageIcon.prototype.ICON_BULB_FAMILY,mindplot.ImageIcon.prototype.ICON_THUMB_FAMILY, mindplot.ImageIcon.prototype.ICON_TICK_FAMILY,mindplot.ImageIcon.prototype.ICON_ONOFF_FAMILY, mindplot.ImageIcon.prototype.ICON_MONEY_FAMILY, mindplot.ImageIcon.prototype.ICON_CHART_FAMILY, mindplot.ImageIcon.prototype.ICON_FLAG_FAMILY, mindplot.ImageIcon.prototype.ICON_BULLET_FAMILY, mindplot.ImageIcon.prototype.ICON_TAG_FAMILY];