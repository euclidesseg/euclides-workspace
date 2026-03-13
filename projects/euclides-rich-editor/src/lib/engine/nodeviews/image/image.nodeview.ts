import { Node } from "prosemirror-model";
import { EditorView, NodeView } from "prosemirror-view";
import { NodeSelection } from "prosemirror-state";

export class ImageNodeView implements NodeView {

    dom: HTMLElement;
    img: HTMLImageElement;
    handle: HTMLElement;

    private view: EditorView;
    private getPos: () => number | undefined;

    constructor(node: Node, view: EditorView, getPos: () => number | undefined) {

        this.view = view;
        this.getPos = getPos;

        // =========================
        // Wrapper
        // =========================
        this.dom = document.createElement("div");
        this.dom.className = "pm-image-wrapper";

        // =========================
        // Image
        // =========================
        this.img = document.createElement("img");
        this.img.src = node.attrs["src"];
        this.img.style.width = node.attrs["width"] || "auto";

        // =========================
        // Resize handle
        // =========================
        this.handle = document.createElement("div");
        this.handle.className = "resize-handle";
        this.handle.style.display = "none"; // 👈 oculto inicialmente

        this.dom.appendChild(this.img);
        this.dom.appendChild(this.handle);

        // =========================
        // CLICK → seleccionar imagen
        // =========================
        this.dom.addEventListener("mousedown", (e) => {
            // evitar que el editor cambie selección a texto
            e.preventDefault();

            const pos = this.getPos();
            if (pos == null) return;

            const tr = this.view.state.tr.setSelection(
                NodeSelection.create(this.view.state.doc, pos)
            );

            this.view.dispatch(tr);
        });

        // =========================
        // RESIZE LOGIC
        // =========================
        let startX = 0;
        let startWidth = 0;

        this.handle.addEventListener("mousedown", (e) => {

            e.preventDefault();
            e.stopPropagation(); // ⭐ importante

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

                const pos = this.getPos();
                if (pos === undefined) return;

                const tr = this.view.state.tr.setNodeMarkup(
                    pos,
                    undefined,
                    {
                        ...node.attrs,
                        width: `${newWidth}px`
                    }
                );

                this.view.dispatch(tr);

                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);
            };

            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
        });
    }

    // =========================
    // sincronización estado → DOM
    // =========================
    update(node: Node) {
        if (node.type.name !== "image") return false;

        this.img.src = node.attrs["src"];
        this.img.style.width = node.attrs["width"] || "auto";

        return true;
    }

    // =========================
    // cuando ProseMirror selecciona nodo
    // =========================
    selectNode() {
        this.dom.classList.add("ProseMirror-selectednode");
        this.handle.style.display = "block";
    }

    deselectNode() {
        this.dom.classList.remove("ProseMirror-selectednode");
        this.handle.style.display = "none";
    }

    // evita que ProseMirror robe eventos
    stopEvent() {
        return true;
    }
}