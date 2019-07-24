class MonacoEditor extends HTMLElement {
    get container() {
        if (this._container == null) {
            this._container = document.createElement("div");
            this._container.style.width = "100%";
            this._container.style.height = "100%";
        }

        return this._container;
    }

    set container(newValue) {
        this._container = newValue;
    }

    get language() {
        if (this._language == null) {
            this._language = this.getAttribute("language");
        }
        return this._language;
    }

    set language(newValue) {
        this._language = newValue;
    }

    async connectedCallback() {
        if (window.monacoScriptsLoaded != true) {
            await loadScript("/node_modules/monaco-editor/min/vs/loader.js");
            await loadScript("/node_modules/monaco-editor/min/vs/editor/editor.main.nls.js");
            await loadScript("/node_modules/monaco-editor/min/vs/editor/editor.main.js");
            window.monacoScriptsLoaded = true;
        }

        this.appendChild(this.container);
        this.editor = monaco.editor.create(this.container, {
            language: this.language
        });

        this.setValue(this._value);
    }

    disconnectedCallback() {
        this.container = null;
        this.editor = null;
    }

    getValue() {
        return this.editor.getValue();
    }

    setValue(newValue) {
        this._value = newValue;

        if (this.editor != null) {
            this.editor.setValue(newValue);
            const model = this.editor.getModel();
            monaco.editor.setModelLanguage(model, this.language);
        }
    }

    loadFile(file) {
        fetch(file)
            .then(result => result.text())
            .then(text => this.setValue(text));
    }
}

function loadScript(path) {
    return new Promise(resolve => {
        const script = document.createElement("script");
        script.src = path;
        script.onload = () => {
            script.onload = null;
            resolve();
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    })
}

window.require = {paths:{'vs': '/node_modules/monaco-editor/min/vs'}};
customElements.define("monaco-editor", MonacoEditor);