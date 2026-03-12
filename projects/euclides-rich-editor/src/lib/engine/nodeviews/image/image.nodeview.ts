import { Node } from "prosemirror-model";
import { EditorView, NodeView } from "prosemirror-view";

export class ImageNodeView implements NodeView {

    dom: HTMLElement;
    img: HTMLImageElement;

    constructor(node: Node, view: EditorView, getPos: () => number | undefined) {

        this.dom = document.createElement("div");
        this.dom.className = "pm-image-wrapper";

        this.img = document.createElement("img");
        this.img.src = node.attrs["src"];
        this.img.style.width = node.attrs["width"] || "auto";

        const handle = document.createElement("div");
        handle.className = "resize-handle";

        this.dom.appendChild(this.img);
        this.dom.appendChild(handle);

        let startX = 0;
        let startWidth = 0;

        handle.addEventListener("mousedown", (e) => {

            e.preventDefault();

            startX = e.clientX;
            startWidth = this.img.offsetWidth;

            const onMove = (e: MouseEvent) => {
                const diff = e.clientX - startX;
                const newWidth = Math.max(50, startWidth + diff);

                this.img.style.width = `${newWidth}px`;
            };

            const onUp = (e: MouseEvent) => {

                const diff = e.clientX - startX;
                const newWidth = Math.max(50, startWidth + diff);

                const pos = getPos();
                if (pos === undefined) return;

                const tr = view.state.tr.setNodeMarkup(
                    pos,
                    undefined,
                    {
                        ...node.attrs,
                        width: `${newWidth}px`
                    }
                );

                view.dispatch(tr);

                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);
            };

            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
        });
    }

    update(node: Node) {
        if (node.type.name !== "image") return false;

        this.img.src = node.attrs["src"];
        this.img.style.width = node.attrs["width"] || "auto";

        return true;
    }

    stopEvent() {
        return true;
    }
}