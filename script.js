"use strict";

const HTML = {}; 
const allStudents= [];
let studentData;
let filteredStudents;

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
    // make buttons into variables
    HTML.allFilterBtn = document.querySelectorAll("[data-action=filter]");
    HTML.allSortBtn = document.querySelectorAll("[data-action=sort]");
      // Add event-listeners to btn and run the filter animal list
    HTML.allFilterBtn.forEach((btn) => {
        btn.addEventListener("click", filterTheList);
    });
    HTML.allSortBtn.forEach((btn) => {
        btn.addEventListener("click", sortTheList);
    });

    loadJSON();
};

async function loadJSON() {
    const jsonData = await fetch(theJsonfile);
    studentData = await jsonData.json();
    
    cleaningUpJson();
};

function cleaningUpJson() {
    studentData.forEach(arrayObject => {
        const student = Object.create(studentArray);
// console.log(student)
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
        displayStudent(student);
        
    });
    
};

function displayStudent(student) {
    // document.querySelector("#list tbody").innerHTML = "";

    const clone = document.querySelector("template#student").content.cloneNode(true);

    clone.querySelector("[data-field=first_name]").textContent = student.firstName;
    clone.querySelector("[data-field=last_name]").textContent = student.lastName;
    clone.querySelector("[data-field=house]").textContent = student.house;

    clone.querySelector(".popup_button").addEventListener("click", openPopup);
    document.querySelector("#list tbody").appendChild( clone );
    
};


function filterTheList(){
    
    //hent datasæt fra klikket knap
    let filterType = this.dataset.filter
    if (filterType === "*"){
       filteredStudents = allStudents;
       
    }else{
        filteredStudents = allStudents.filter(isStudentFilter);
  
        function isStudentFilter(student) {
            if(student.filterType === filterType){
               return true; 
            } else {
               return false;
            };
        };
    };
    displayStudent(filteredStudents)
};

function sortTheList(){
    
    //hent datasæt fra klikket knap
    let sortFilter = this.dataset.sort;
 
    filteredStudents.sort(sortByValue);

    function sortByValue(a,b){
        if (a[sortFilter] < b[sortFilter]){
            
            return -1;
        } else {
            return 1;
            
        }
    };
  displayStudent(filteredStudents);
};

function openPopup() {
    console.log("open sesame");
    const popup = document.querySelector(".popup");
    popup.style.display = "block";
};
document.querySelector(".closePopup").addEventListener("click", CloseThePopup);

function CloseThePopup(){
    document.querySelector(".popup").style.display = "none";
  };