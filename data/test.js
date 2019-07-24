export class Test {
    get property1() {
        return this._property1;
    }

    set property1(newValue) {
        this._property1 = newValue;
    }

    constructor() {
        this.property1 = "Hello World";
    }

    log() {
        console.log(this.property1);
    }
}

const test = new Test();
test.log();