export class Brand {
    
    public name:string;
    public welcome:string;
    public logoPath:string;
    public colorTheme:string;
    public baseUrlApi:string;
    public company:string;
    public appUrl:string;
    // public bye:string;

    constructor(name:string, welcome:string, logoPath:string, colorTheme:string, baseUrlApi:string, company:string, appUrl:string ){
        this.name = name;
        this.welcome = welcome;
        this.logoPath = logoPath;
        this.colorTheme = colorTheme;
        this.baseUrlApi = baseUrlApi;
        this.company = company;
        this.appUrl = appUrl;
        // this.bye = bye;
    }
}