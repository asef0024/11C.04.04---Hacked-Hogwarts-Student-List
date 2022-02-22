"use strict";

const allStudents= [];
let studentData;

const studentArray = {
    firstName: "",
    lastName: "",
    middleName: "",
    nickName: "",
    gender: "",
    imgSrc: "",
    house: "",
};

const theJsonfile = "https://petlatkea.dk/2021/hogwarts/students.json";

window.addEventListener("DOMContentLoaded", start);

function start() {
    console.log("start");
    loadJSON();
};

async function loadJSON() {
    console.log("loading Json");
    const jsonData = await fetch(theJsonfile);
    studentData = await jsonData.json();
    console.table(studentData);
    cleaningUpJson();
};

function cleaningUpJson() {
    console.log("am I cleaning?");
    studentData.forEach((arrayObject) => {
        const student = Object.create(studentArray);

        let fullName = arrayObject.fullname.trim();
        let house = arrayObject.house.trim();
        let gender = arrayObject.gender.trim();
          
        //Make firstnames
        student.firstName = 
        fullName.substring(0,1).toUpperCase() + 
        fullName.substring(1, fullName.indexOf(" ")).toLowerCase();

        //Make lastnames
        student.lastName =
        fullName
        .substring(fullName.lastIndexOf(" ") + 1, fullName.lastIndexOf(" ") + 2)
        .toUpperCase() + fullName.substring(fullName.lastIndexOf(" ") + 2).toLowerCase();

        //Make middlename
        student.middleName =
        fullName
        .substring(fullName.indexOf(" "), fullName.lastIndexOf(" "))
        .trim().substring(0, 1).toUpperCase() +
        fullName
        .substring(fullName.indexOf(" "), fullName.lastIndexOf(" "))
        .trim().substring(1).toLowerCase();

        //Nickname
        if (fullName.includes(`"`)) {
            student.nickName = fullName.substring(fullName.indexOf(`"`) + 1, fullName.lastIndexOf(`"`));
            student.middleName = "";
        }
          
        // Gender
        student.gender = gender.charAt(0).toUpperCase() + gender.substring(1).toLowerCase();

        //House
        student.house = house.charAt(0).toUpperCase() + house.substring(1).toLowerCase();

        allStudents.push(student);
    });
    showAllStudents();
};

function showAllStudents() {
    console.table(allStudents)
}
