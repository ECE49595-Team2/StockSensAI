export enum Avatar {
    Avatar1 = '/avatar-1.png',
    Avatar2 = '/avatar-2.png',
    Avatar3 = '/avatar-3.png',
    Avatar4 = '/avatar-4.png',
}

class User {
    public email?: string;
    public name?: string;
    public avatar?: Avatar;
    public prefs: { [key: string]: any } = {};

    private _getRandomAvatar(): Avatar {
        const avatars = Object.values(Avatar);
        return avatars[Math.floor(Math.random() * avatars.length)];
    }

    public async fetchUserData() {
        const response = await fetch("/api/user/prefs", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                email: this.email,
            }),
        });
        const data = await response.json();
        Object.keys(data).forEach((key) => {
            if (key !== "name")
                this.prefs[key] = data.prefs[key];
        });
        this.name = data.prefs.name;
    }

    constructor(email?: string, name?: string) {
        this.email = email;
        this.name = name;

        this.avatar = this._getRandomAvatar();
    }

    public toJson(): string {
        return JSON.stringify(this);
    }
}



export default User;