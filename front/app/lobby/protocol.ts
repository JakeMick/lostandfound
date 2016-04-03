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
    chatroom;
    id;
    author;
    body;
    isSystemMessage = false;
    constructor(mesg: string) {
        super()
        let splitted = this.split(mesg);
        this.chatroom = +splitted[0]
        this.id = +splitted[1];
        this.author = atob(splitted[2])
        this.body = atob(splitted[3]);
    }

}