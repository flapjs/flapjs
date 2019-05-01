import AbstractInputHandler from 'util/input/AbstractInputHandler.js';

class ViewportInputHandler extends AbstractInputHandler
{
    constructor()
    {
        super();

        this._prevX = 0;
        this._prevY = 0;
    }

    /** @override */
    onDragStart(pointer)
    {
        this._prevX = pointer.x;
        this._prevY = pointer.y;
        return true;
    }

    /** @override */
    onDragMove(pointer)
    {
        const dx = pointer.x - this._prevX;
        const dy = pointer.y - this._prevY;
        const adapter = pointer.getAdapter();
        const viewport = adapter.getViewport();
        viewport.addOffset(dx, dy, true);
        return true;
    }

    /** @override */
    onDragStop(pointer)
    {
    //Do nothing. It should already be moved.
        return true;
    }
}

export default ViewportInputHandler;
