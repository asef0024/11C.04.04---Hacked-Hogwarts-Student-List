"use strict";

//........................VARIABLES........................//
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
    prefect: false
};

const theJsonfile = "https://petlatkea.dk/2021/hogwarts/students.json";

//................................................//

window.addEventListener("DOMContentLoaded", start);

function start() {
    registeredButtons();
    loadJSON();
};

function registeredButtons() {
    document.querySelectorAll("[data-action=filter]")
    .forEach(button => button.addEventListener("click", selectFilter))
    document.querySelectorAll("[data-action=sort]")
    .forEach(button => button.addEventListener("click", selectSort))
}

//........................JSON........................//

async function loadJSON() {
    const response = await fetch(theJsonfile);
    let jsonData = await response.json();
    
    // cleaningUpJson();
    prepareObjects (jsonData);
};

function prepareObjects(jsonData) {
    allStudents = jsonData.map( prepareObject);

    buildList();
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
    if (fullName.includes(" ")) {
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

//........................RENDER LIST........................//

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
   

    //prefect
    clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
    clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);

    function clickPrefect() {
        if (student.prefect === true) {
            student.prefect = false;
        }else {
            makePrefects(student);
        }
        buildList();
    }
    document.querySelector("#list tbody").appendChild( clone );
}

function buildList() {
    let currentList = filterList(allStudents);
    const sortedList = sortList(currentList);

    displayList(sortedList);
}

//........................FILTERING........................//

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

//........................SORT........................//

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


//........................PREFECT........................//

function makePrefects(selectedStudent) {

    const prefects = allStudents.filter( student => student.prefect);
    const numberOfPrefects = prefects.length;
    const other = prefects.filter(student => student.house === selectedStudent.house).shift();
   
    console.log(numberOfPrefects)
    //if there is another of the same gender

    if ( other !== undefined) {
        console.log("there can only be 1 prefect of each gender");
        removeOther(other);
    }else if (numberOfPrefects >= 2) {
        console.log("there can only be 2 prefects");
        removeAorB(prefects[0],prefects[1]);
    }else{
        makePrefects(selectedStudent);
    }

  

    function removeOther(other) {
        document.querySelector("#remove_other").classList.remove("hide");
        document.querySelector("#remove_other .closebutton").addEventListener("click", closeDialog);
        document.querySelector("#remove_other #removeother").addEventListener("click", clickRemoveOther);
        document.querySelector("#remove_other [data-field=otherprefect]").textContent = other.firstName;

         // ask the user to ignore or remove "others"
        function closeDialog() {
            document.querySelector("#remove_other").classList.add("hide");
            document.querySelector("#remove_other #removeother").removeEventListener("click", clickRemoveOther);
            document.querySelector("#remove_other .closebutton").removeEventListener("click", closeDialog);
        }
        //if ignore - do nothing
        function clickRemoveOther() {
            removePrefect(other);
            makePrefects(selectedStudent);
            buildList();
            closeDialog();
        }
        

        //if remove other:
        removePrefect(other);
        makePrefects(selectedStudent);

    }

    function removeAorB(prefectA, prefectB) {

        //ask to ignore or remove A og B
        document.querySelector("#remove_aorb").classList.remove("hide");
        document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
        document.querySelector("#remove_aorb #removeA").addEventListener("click", clickRemoveA);
        document.querySelector("#remove_aorb #removeB").addEventListener("click", clickRemoveB);
        document.querySelector("#remove_aorb[data-field=prefectA]").textContent = prefectA.firstName;
        document.querySelector("#remove_aorb[data-field=prefectB]").textContent = prefectB.firstName;

        
        //if ignore - do nothing
        function closeDialog(){
        document.querySelector("#remove_aorb").classList.add("hide");
        document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
        document.querySelector("#remove_aorb #removeA").removeEventListener("click", clickRemoveA);
        document.querySelector("#remove_aorb #removeB").removeventListener("click", clickRemoveB);
        }

        //if removeA:
        function clickRemoveA() {
            removePrefect(prefectA);
            makePrefects(selectedStudent);
            buildList();
            closeDialog();
        }
        //else -if removeB
        function clickRemoveB() {
            removePrefect(prefectB);
            makePrefects(selectedStudent);
            buildList();
            closeDialog();
        }
    }

    function removePrefect(prefectStudent) {
        prefectStudent.prefect = false;
    }

    function makePrefects(student) {
        student.prefect = true;
    }
}

//........................POP UP........................//

function openPopup() {
    console.log("open sesame");
    const popup = document.querySelector(".popup");
    popup.style.display = "block";
};
document.querySelector(".closePopup").addEventListener("click", CloseThePopup);

function CloseThePopup(){
    document.querySelector(".popup").style.display = "none";
  };