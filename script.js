"use strict";

const HTML = {}; 
let allStudents= [];
let filteredStudents;
// let filterBy = "*";
const settings = {
    filterBy : "*",
    sortBy : "firstName",
    sortDir:  "asc"
}

const Student = {
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
    registeredButtons();
  
    HTML.allSortBtn = document.querySelectorAll("[data-action=sort]");
      // Add event-listeners to btn and run the filter animal list

    HTML.allSortBtn.forEach((btn) => {
        btn.addEventListener("click", selectSort);
    });

    loadJSON();
};

function registeredButtons() {
    document.querySelectorAll("[data-action=filter]")
    .forEach(button => button.addEventListener("click", selectFilter))
}

async function loadJSON() {
    const response = await fetch(theJsonfile);
    let jsonData = await response.json();
    
    // cleaningUpJson();
    prepareObjects (jsonData);
};

function prepareObjects(jsonData) {
    allStudents = jsonData.map( prepareObject);

    displayList(allStudents)
}

function prepareObject(jsonObject) {
    const student = Object.create(Student)
        
    let fullName = jsonObject.fullname.trim();
    let house = jsonObject.house.trim();
    let gender = jsonObject.gender.trim();
          
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
    if (fullName.includes(`" "`)) {
        student.nickName = fullName.substring(fullName.indexOf(`"`) + 1, fullName.lastIndexOf(`"`));
        student.middleName = "";
        }
          
    // Gender
    student.gender = gender.charAt(0).toUpperCase() + gender.substring(1).toLowerCase();

    //House
    student.house = house.charAt(0).toUpperCase() + house.substring(1).toLowerCase();

    allStudents.push(student);
     //  displayStudent(student);
    displayList(allStudents);  
    return student 
};

//uskriv liste
function displayList(students) {
    document.querySelector("#list tbody").innerHTML = "";
    students.forEach(displayStudent);
}


function displayStudent(student) {
    const clone = document.querySelector("template#student").content.cloneNode(true);

    clone.querySelector("[data-field=first_name]").textContent = student.firstName;
    clone.querySelector("[data-field=last_name]").textContent = student.lastName;
    clone.querySelector("[data-field=house]").textContent = student.house;

    clone.querySelector(".popup_button").addEventListener("click", openPopup);
    document.querySelector("#list tbody").appendChild( clone );
    
};

function selectFilter(event) {
    let filter = event.target.dataset.filter;
    console.log(filter)
    setFilter(filter);
}

function setFilter(filter) {
    settings.filterBy =filter;
    buildList();
    
}

function filterList(filteredStudents){
console.log("filterere du?")
    
    if (settings.filterBy === "Gryffindor"){
       filteredStudents = allStudents.filter(filterByGryffindor); 
       console.log(filteredStudents)
    }else if (settings.filterBy === "Slytherin"){
        filteredStudents = allStudents.filter(filterBySlytherin);    
    }else if (settings.filterBy === "Hufflepuff"){
        filteredStudents = allStudents.filter(filterByHufflepuff);    
    }else if (settings.filterBy === "Rawenclaw"){
        filteredStudents = allStudents.filter(filterByRawenclaw);    
    }
    return filteredStudents;
};

function filterByGryffindor(student) {
    
    return student.house === "Gryffindor";
}
function filterBySlytherin(student) {
    return student.house === "Slytherin";
}
function filterByHufflepuff(student) {
    return student.house === "Hufflepuff";
}
function filterByRawenclaw(student) {
    return student.house === "Rawenclaw";
}

function selectSort(event) {
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;
  
    // find old sorting element
    const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
    oldElement.classList.remove("sortby");
  
    // show arrow and indicate whats sorting / add class to active sort
    event.target.classList.add("sortby");
  
    // toggle the direction
    if (sortDir === "asc") {
      event.target.dataset.sortDirection = "desc";
    } else {
      event.target.dataset.sortDirection = "asc";
    }
    // console.log(`user selected ${sortBy} - ${sortDir}`);
    setSort(sortBy, sortDir);
  }

// function selectSort(event) {
//     const sortBy = event.target.dataset.sort;
//     const sortDir = event.target.dataset.sortDirection;

//     //find "old" sortBy element 
//     const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
//     console.log(document.querySelector(`[data-sort='${settings.sortBy}']`))
//     oldElement.classList.remove("sortby");

//     //indicate active sort
//     event.target.classList.add("sortby");

//     //toggle the direction
//     if (sortDir === "asc") {
//         event.target.dataset.sortDirection = "desc";
//     }else {
//         event.target.dataset.sortDirection = "asc";
//     }
   
//     setSort(sortBy, sortDir);
// }

function setSort(sortBy, sortDir) {
    settings.sortBy = sortBy;
    settings.sortDir =sortDir;
    buildList();
}

function sortList(sortedList){

    
    let direction = 1;
    if (settings.sortDir === "desc") {
        direction = -1;
    }else {
        direction =1;
    }
    sortedList = sortedList.sort(sortByValue);
    function sortByValue(a,b){
        if (a[settings.sortBy] < b[settings.sortBy]){
            return -1 * direction;
        } else {
            return 1 * direction;
            
        };
    };
    return sortedList;
};

function buildList() {
    let currentList = filterList(allStudents);
    const sortedList = sortList(currentList);

    displayList(sortedList);
}

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