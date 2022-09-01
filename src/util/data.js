export default class Data {

    static myInstance = null;

    _userID = 0;
    _userEmail = "";
    _userPrename = "";
    _userLastname = "";
    _birthDate = "";
    _levelOfEducation = "";
    _userPoints = "0";


    /**
     * @returns {Data}
     */
    static getInstance() {
        if (Data.myInstance == null) {
            Data.myInstance = new Data();
        }

        return this.myInstance;
    }

    getUserID() {
        return this._userID;
    }

    setUserID(id) {
        this._userID = id;
    }

    getUserEmail() {
        return this._userEmail;
    }

    setUserEmail(email) {
        this._userEmail = email;
    }

    getUserPrename() {
        return this._userPrename;
    }

    setUserPrename(name) {
        this._userPrename = name;
    }

    getUserLastname() {
        return this._userLastname;
    }

    setUserLastname(name) {
        this._userLastname = name;
    }

    getBirthDate() {
        return this._birthDate;
    }

    setBirthDate(date) {
        this._birthDate = date;
    }

    getLevelOfEducation() {
        return this._levelOfEducation;
    }

    setLevelOfEducation(levelOfEducation) {
        this._levelOfEducation = levelOfEducation;
    }

    getUserPoints() {
        return this._userPoints;
    }

    setUserPoints(userPoints) {
        this._userPoints = userPoints;
    }

    clearAllUserData(){
        this._userID = 0;
        this._userEmail = "";
        this._birthDate = "";
        this._levelOfEducation = "";
        this._userPoints = "0";
    }
}