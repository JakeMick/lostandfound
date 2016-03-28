export enum Protocol {
    AUTH,
    MESG
}

export class Response {
    split(mesg: string) : Array<string> {
        return mesg.split(":").slice(1);
    }
}

export class Request {
    private prototype;

    private elems = Array<String>();

    constructor(prototype: Protocol) {
        this.prototype = prototype;
        this.elems.push(prototype.toString());
    }

    private addSep() {
        this.elems.push(":");
    }

    addInt(elem: number) {
        this.addSep();
        this.elems.push(elem.toString());
    }

    addJWT(elem: string) {
        this.addSep();
        this.elems.push(elem);
    }
    
    addString(elem: string) {
        this.addSep();
        this.elems.push(btoa(elem));
    }

    build(): string {
        return this.elems.join('');
    }
}

export class AuthRequest extends Request {
    constructor(private jwt: string) {
        super(Protocol.AUTH);
        this.addJWT(jwt);
    }
}

export function messageType(mesg: string) : Protocol {
    return +mesg.split(":")[0]
}

export class ChatMessage extends Response {
    id;
    author;
    body;

    constructor(mesg: string) {
        super()
        let splitted = this.split(mesg);
        this.id = +splitted[0];
        this.author = atob(splitted[1])
        this.body = atob(splitted[2]);
    }

}