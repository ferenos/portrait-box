const { expect } = require('chai');
const sinon = require('sinon');
const { PortraitBox } = require('../portrait-box.js');
const { CONST } = require('../const.js');
const { hoverObservable } = require('../hooks.js');
const { getExtraModules } = require('../settings.js');
const { getSetting } = require('../utils.js');

// test/portrait-box.test.js

describe('PortraitBox', function() {
    let portraitBox;

    beforeEach(function() {
        portraitBox = new PortraitBox();
    });

    it('should have default options', function() {
        const defaultOptions = PortraitBox.defaultOptions;
        expect(defaultOptions.left).to.equal(0);
        expect(defaultOptions.top).to.equal(0);
        expect(defaultOptions.width).to.equal(game.settings.get(CONST.MODULE_NAME, "width"));
        expect(defaultOptions.height).to.equal(game.settings.get(CONST.MODULE_NAME, "height"));
        expect(defaultOptions.id).to.equal(CONST.MODULE_NAME);
        expect(defaultOptions.template).to.equal(`modules/${CONST.MODULE_NAME}/templates/portrait-box.html`);
        expect(defaultOptions.popOut).to.be.false;
    });

    it('should inject HTML', async function() {
        const html = '<div></div>';
        const afterSpy = sinon.spy($.prototype, 'after');
        await portraitBox._injectHTML(html);
        expect(afterSpy.calledOnce).to.be.true;
        afterSpy.restore();
    });

    it('should render and initialize settings and CSS variables', async function() {
        const initSettingsSpy = sinon.spy(portraitBox, '#initSettings');
        const initCssVariablesSpy = sinon.spy(portraitBox, '#initCssVariables');
        await portraitBox.render();
        expect(initSettingsSpy.calledOnce).to.be.true;
        expect(initCssVariablesSpy.calledOnce).to.be.true;
        initSettingsSpy.restore();
        initCssVariablesSpy.restore();
    });

    it('should initialize settings', function() {
        const getSettingStub = sinon.stub().returns('test');
        expect(portraitBox.settings.anchor).to.equal('test');
        getSettingStub.restore();
    });

    it('should initialize CSS variables', function() {
        portraitBox.settings = {
            mask: 'mask.png',
            border: 'border.png',
            background: 'background.png',
            fontSize: '12px',
            font: 'Arial',
            width: 100,
            heigth: 200,
            horizontal: '10px',
            vertical: '20px',
            labelBgColor: 'red',
            labelVertical: 'top',
            backgroundFilter: 'none',
            imageFilter: 'none',
            anchor: 'top-left'
        };
        expect(portraitBox.element.css('--pb-font-size')).to.equal('12px');
        expect(portraitBox.element.css('--pb-font')).to.equal('Arial');
        expect(portraitBox.element.css('--pb-width')).to.equal('100px');
        expect(portraitBox.element.css('--pb-height')).to.equal('200px');
        expect(portraitBox.element.css('--pb-mask')).to.equal('url(../../../mask.png)');
        expect(portraitBox.element.css('--pb-horizontal')).to.equal('10px');
        expect(portraitBox.element.css('--pb-vertical')).to.equal('20px');
        expect(portraitBox.element.css('--pb-label-bg-color')).to.equal('red');
        expect(portraitBox.element.css('--pb-border')).to.equal('url(../../../border.png)');
        expect(portraitBox.element.css('--pb-label-vertical')).to.equal('top');
        expect(portraitBox.element.css('--pb-background')).to.equal('url(../../../background.png)');
        expect(portraitBox.element.css('--pb-background-filter')).to.equal('none');
        expect(portraitBox.element.css('--pb-image-filter')).to.equal('none');
        expect(portraitBox.element.attr('class')).to.equal(CONST.ANCHOR_CLASSES['top-left']);
    });

    it('should show token', function() {
        const token = {
            document: {
                isLinked: true,
                texture: { src: 'token.png' },
                hasPlayerOwner: true
            },
            actor: { img: 'actor.png', name: 'Actor' }
        };
        portraitBox.settings = {
            showLabel: true,
            animationDuration: '1s',
            animationEnabled: true,
            animation: 'fadeIn',
            anchor: 'top-left'
        };
        portraitBox.show(token);
        expect(portraitBox.element.find('.portrait').css('background-image')).to.equal('url("actor.png")');
        expect(portraitBox.element.find('.label').html()).to.equal('Actor');
        expect(portraitBox.element.css('--animate-duration')).to.equal('1s');
        expect(portraitBox.element.attr('class')).to.equal(CONST.ANCHOR_CLASSES['top-left']);
    });

    it('should hide token', function() {
        const token = {
            document: {
                isLinked: true,
                texture: { src: 'token.png' },
                hasPlayerOwner: true
            },
            actor: { img: 'actor.png', name: 'Actor' }
        };
        portraitBox.settings = {
            outAnimationDuration: '1s',
            animationEnabled: true,
            outAnimation: 'fadeOut',
            anchor: 'top-left'
        };
        portraitBox.hide(token);
        expect(portraitBox.element.css('--animate-duration')).to.equal('1s');
        expect(portraitBox.element.attr('class')).to.equal(CONST.ANCHOR_CLASSES['top-left']);
    });

    it('should determine if token should be shown', function() {
        const token = {
            document: {
                hidden: false,
                hasPlayerOwner: true,
                isLinked: true
            }
        };
        portraitBox.settings = {
            showPc: true,
            showLinkedGm: true,
            showUnlinkedGm: true
        };
        expect(portraitBox.shouldShown(token)).to.be.true;
    });
});