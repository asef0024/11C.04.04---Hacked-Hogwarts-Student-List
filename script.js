"use strict";

//........................VARIABLES........................//
let allStudents = [];
let bloodStatusJSON = {};
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
    fullName: "",
    nickName: "",
    gender: "",
    imgSrc: "",
    house: "",
    bloodStatus: "",
    prefect: false,
    expelled: false
};

const theJsonfile1 = "https://petlatkea.dk/2021/hogwarts/families.json";
const theJsonfile2 = "https://petlatkea.dk/2021/hogwarts/students.json";

//................................................//

window.addEventListener("DOMContentLoaded", start);

async function start() {
    registeredButtons();
    await loadBloodStatusJSON();
    await loadStudentsJSON();
};

function registeredButtons() {
    document.querySelectorAll("[data-action=filter]")
    .forEach(button => button.addEventListener("click", selectFilter))
    document.querySelectorAll("[data-action=sort]")
    .forEach(button => button.addEventListener("click", selectSort))
    document.querySelector("#search").addEventListener("input", searchFieldInput);
}

//........................SEARCH FIELD........................//

function searchFieldInput(evt) {
    // write to the list with only those elemnts in the allAnimals array that has properties containing the search frase
    displayList(
      allStudents.filter((student) => {
        // comparing in uppercase so that m is the same as M
        let value =student.firstName.toUpperCase().includes(evt.target.value.toUpperCase()) 
        || student.lastName.toUpperCase().includes(evt.target.value.toUpperCase())
        || student.house.toUpperCase().includes(evt.target.value.toUpperCase());
  
        return value;
      })
    );
  }

  
//........................JSON........................//

async function loadBloodStatusJSON() {
    const response = await fetch(theJsonfile1);
    let jsonData = await response.json();

    bloodStatusJSON = jsonData;
};

async function loadStudentsJSON() {
    const response = await fetch(theJsonfile2);
    let jsonData = await response.json();
  
    prepareStudentObject(jsonData);
};

function prepareStudentObject(jsonData) {
    
    console.log("prepareObjects", jsonData)
    allStudents = jsonData.map(prepareObject);

    buildList();
}

function prepareObject(jsonObject) {
    const student = Object.create(Student)
    
        
    let fullName = jsonObject.fullname.trim();
    let house = jsonObject.house.trim();
    let gender = jsonObject.gender.trim();

    student.fullName = fullName.split(" ").map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(" ");
          
    //Make firstnames
    if (fullName.includes(" ")) {
        student.firstName = 
        fullName.substring(0,1).toUpperCase() + 
        fullName.substring(1, fullName.indexOf(" ")).toLowerCase();
    } else {
        student.firstName =
        fullName.substring(0, 1).toUpperCase() + fullName.substring(1).toLowerCase();
    }
    

    //Make lastnames
    if (fullName.includes(" ")){
        student.lastName =
        fullName
        .substring(fullName.lastIndexOf(" ") + 1, fullName.lastIndexOf(" ") + 2)
        .toUpperCase() + fullName.substring(fullName.lastIndexOf(" ") + 2).toLowerCase();
    }

    //Make middlename
    student.middleName = fullName.substring(
        fullName.indexOf(" ") + 1,
        fullName.lastIndexOf(" ")
      );
      student.middleName =
        student.middleName.substring(0, 1).toUpperCase() +
        student.middleName.substring(1).toLowerCase();

    //Nickname
    if (fullName.includes(`"`)) {
        student.middleName = "";
        student.nickName = fullName.substring(
            fullName.indexOf(`"`),
            fullName.lastIndexOf(`"`) + 1
        );
      }
          
    // Gender
    student.gender = gender.charAt(0).toUpperCase() + gender.substring(1).toLowerCase();

    //House
    student.house = house.charAt(0).toUpperCase() + house.substring(1).toLowerCase();

    //img 
    student.imgSrc = `./images/${fullName
        .substring(0, fullName.indexOf(" "))
        .toLowerCase()}_.png`;
      student.imgSrc = `./images/${
        fullName
          .substring(fullName.lastIndexOf(" ") + 1, fullName.lastIndexOf(" ") + 2)
          .toLowerCase() + fullName.substring(fullName.lastIndexOf(" ") + 2).toLowerCase()
      }_${fullName.substring(0, 1).toUpperCase().toLowerCase()}.png`;

    student.bloodStatus = getBloodStatus(student);

    allStudents.push(student);
     //  displayStudent(student);
    
    return student 
};

function getBloodStatus(student) {
    if (bloodStatusJSON.pure.indexOf(student.lastName) > -1) {
        return "pure";
    } else if (bloodStatusJSON.half.indexOf(student.lastName) > -1) {
        return "half-blood"
    } else {
        return "muggle";
    }
}

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
    clone.querySelector("[data-field=blood_status]").textContent = student.bloodStatus;

    clone.querySelector(".popup_button").addEventListener("click", () => openPopup(student));
   

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
    return filteredStudents.filter(s => s.expelled === false);
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

    const prefects = allStudents.filter(student => student.prefect && student.house === selectedStudent.house);
    const numberOfPrefects = prefects.length;
 
    if (numberOfPrefects >= 2) {
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
        document.querySelector("#remove_aorb [data-field=prefectA]").textContent = prefectA.firstName;
        document.querySelector("#remove_aorb [data-field=prefectB]").textContent = prefectB.firstName;

        
        //if ignore - do nothing
        function closeDialog(){
        document.querySelector("#remove_aorb").classList.add("hide");
        document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
        document.querySelector("#remove_aorb #removeA").removeEventListener("click", clickRemoveA);
        document.querySelector("#remove_aorb #removeB").removeEventListener("click", clickRemoveB);
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

function openPopup(student) {
    console.log("open sesame");
    const popup = document.querySelector(".popup");
    popup.style.display = "block";

    document.querySelector(".full_name span").textContent = student.fullName;
    document.querySelector(".nick_name span").textContent = student.nickName;
    document.querySelector(".house span").textContent = student.house;
    document.querySelector(".blood_status span").textContent = student.bloodStatus;

    document.querySelector(".expel_student").addEventListener("click", () => expelStudent(student));
};
document.querySelector(".closePopup").addEventListener("click", CloseThePopup);


function CloseThePopup(){
    document.querySelector(".popup").style.display = "none";
  };


//........................EXPELLED STATUS........................//

function expelStudent(student) {
    if (confirm(`Do you want to expel ${student.firstName}?`)) {
        student.expelled = true;
        console.log(allStudents)
        CloseThePopup();
        buildList();
    }
}

