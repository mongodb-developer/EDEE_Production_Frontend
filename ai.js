// Emulates an external AI service like OpenAI , AWS Bedrock etc
// This assume you have connected to the database server

class AIService {

    constructor(obj) {
        const {authentication} = obj
        if(authentication == null || authentication == undefined || authentication instanceof MongoClient == false) {
            throw new Error("AIService needs a valid MongoDB Driver in EDEE to Authenticate user")
        }
       this.mongoClient = authentication;
    }

    async promptToText(prompt) {
        this.user = await mongoClient.getRealmUser();
        const rval = await this.user.functions.ai_promptToText({prompt});
        //TODO - Record Timing
        if(rval.ok ) {
            return rval.result;
        } else {
            throw new Error(rval.error);
        }
    }

    async textToVector(concept) {
        this.user = await mongoClient.getRealmUser();
        const  rval = await this.user.functions.ai_textToVector({concept});
        //TODO - Record Timing
        if(rval.ok ) {
            return rval.result;
        } else {
            throw new Error(rval.error);
        }
    }

}