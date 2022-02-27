"use strict";

const HTML = {}; 
let allStudents= [];
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
        btn.addEventListener("click", selectSort);
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
     //  displayStudent(student);
        writeList(allStudents);
        
    });
    
};

//uskriv liste
function writeList(listToDisplay) {
    document.querySelector("#list tbody").innerHTML = "";
    listToDisplay.forEach(displayStudent);
}


function displayStudent(student) {
    const clone = document.querySelector("template#student").content.cloneNode(true);

    clone.querySelector("[data-field=first_name]").textContent = student.firstName;
    clone.querySelector("[data-field=last_name]").textContent = student.lastName;
    clone.querySelector("[data-field=house]").textContent = student.house;

    clone.querySelector(".popup_button").addEventListener("click", openPopup);
    document.querySelector("#list tbody").appendChild( clone );
    
};


function filterTheList(){
    //hent datasæt fra klikket knap
    let toFilteron = "house"
    console.log("filterere du?")
    let filterType = this.dataset.filter
    if (filterType === "*"){
       filteredStudents = allStudents; 
    }else{
        filteredStudents = allStudents.filter(isStudentFilter);
        console.log(filterType)
        function isStudentFilter(student) {
            if(student[toFilteron] === filterType){
               return true; 
            } else {
               return false;
            };
        };
    };
    console.log("filteredStudents",filteredStudents)
    writeList(filteredStudents)
};

function selectSort(event) {
    let sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;

    //toggle the direction
    if (sortDir === "asc") {
        event.target.dataset.sortDirection = "desc";
    }else {
        event.target.dataset.sortDirection = "asc";
    }
   
    sortTheList(sortBy, sortDir);
}

function sortTheList(sortBy, sortDir){
    //hent datasæt fra klikket knap
    let sortedList = allStudents;
    let direction = 1;
    if (sortDir === "desc") {
        direction = -1;
    }else {
        direction =1;
    }
    sortedList = sortedList.sort(sortByValue);
    
    function sortByValue(a,b){
        if (a[sortBy] < b[sortBy]){
            return -1 * direction;
        } else {
            return 1 * direction;
            
        };
    };
    writeList(sortedList);
};

//popup functions

function openPopup() {
    console.log("open sesame");
    const popup = document.querySelector(".popup");
    popup.style.display = "block";
};
document.querySelector(".closePopup").addEventListener("click", CloseThePopup);

function CloseThePopup(){
    document.querySelector(".popup").style.display = "none";
  };