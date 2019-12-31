export class Brand {
    
    public name:string;
    public welcome:string;
    public logoPath:string;
    public colorTheme:string;
    public baseUrlApi:string;
    public company:string;
    public bye:string;

    constructor(name:string, welcome:string, logoPath:string, colorTheme:string, baseUrlApi:string, company:string, bye:string ){
        this.name = name;
        this.welcome = welcome;
        this.logoPath = logoPath;
        this.colorTheme = colorTheme;
        this.baseUrlApi = baseUrlApi;
        this.company = company;
        this.bye = bye;
    }
}