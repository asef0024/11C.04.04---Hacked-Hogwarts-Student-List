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
    expelled: false,
    squad: false
};

const myArray = {
    firstName: "Asefeh",
    lastName: "Zivlaei",
    middleName: "Luca",
    fullName: "Asefeh Luca Zivlaei",
    nickName: "",
    gender: "girl",
    imgSrc: "",
    house: "Gryffindor",
    bloodStatus: "muggle",
    prefect: false,
    expelled: false,
    squad: false
}

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
    
    allStudents = jsonData.map(prepareObject);

    buildList();
}

function prepareObject(jsonObject) {
    const student = Object.create(Student)
        
    let fullName = jsonObject.fullname.trim();
    let house = jsonObject.house.trim();
    let gender = jsonObject.gender.trim();

    // Make fullname
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
    student.imgSrc = `./images/${fullName.substring(0, fullName.indexOf(" ")).toLowerCase()}_.png`;
      student.imgSrc = `./images/${fullName
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

function renderCounts(sortedList) {
       // render amount to fact box
       let gryffindor = 0;
       for (let obj of allStudents) {
           if (obj.house === 'Gryffindor') gryffindor++;
       document.querySelector(".fact_box [data-field=gryffindor]").textContent = gryffindor;
       }
   
       let slytherin = 0;
       for (let obj of allStudents) {
           if (obj.house === 'Slytherin') slytherin++;
       document.querySelector(".fact_box [data-field=slytherin]").textContent = slytherin;
       }
   
       let hufflepuff = 0;
       for (let obj of allStudents) {
           if (obj.house === 'Hufflepuff') hufflepuff++;
        document.querySelector(".fact_box [data-field=hufflepuff]").textContent = hufflepuff;
       }
   
       let ravenclaw = 0;
       for (let obj of allStudents) {
           if (obj.house === 'Ravenclaw') ravenclaw++;
       document.querySelector(".fact_box [data-field=ravenclaw]").textContent = ravenclaw;
       }

       let non_expelled = 0;
       for (let obj of allStudents) {
           if (obj.expelled === false) non_expelled++;
       document.querySelector(".fact_box [data-field=total_non_expelled]").textContent = non_expelled;
       }

       let total_expelled = 0;
       for (let obj of allStudents) {
           if (obj.expelled === true) total_expelled++;
       document.querySelector(".fact_box [data-field=total_expelled]").textContent = total_expelled;
       }

       document.querySelector(".fact_box [data-field=student_showing]").textContent = `${sortedList.length}`;
}

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
   
    // PREFECT
    clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
    clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);

    function clickPrefect() {
        if (student.prefect === true) {
            student.prefect = false;
        }else if (student.expelled === true) {
            student.prefect = false;
            alert("Expelled students can't be made prefects")
        }
        else {
            makePrefects(student);
        }
        buildList();
    }

    // INQUISITORIAL SQUAD
    clone.querySelector("[data-field=squad]").dataset.squad = student.squad;
    clone.querySelector("[data-field=squad]").addEventListener("click", clickSquad);

    function clickSquad() {
        if (student.bloodStatus === "pure") {   
            if (student.squad === true) {
            student.squad = false;
             }else if(student.expelled === true ){
                 student.squad = false;
                 alert("Expelled students can't join the Inquisitorial squad! ")
             }
             else {
                student.squad = true;
            }
        buildList();
        } 
        else {
            alert("Only pure bloods or non expelled students can join the Inquisitorial squad!");
        }
    };


    document.querySelector("#list tbody").appendChild( clone );
}

function buildList() {
    let currentList = filterList(allStudents);
    const sortedList = sortList(currentList);

    
    renderCounts(sortedList);
    displayList(sortedList);
}

//........................FILTERING........................//

function selectFilter(event) {
    let filter = event.target.dataset.filter;
    setFilter(filter);
}

function setFilter(filter) {
    settings.filterBy =filter;
    buildList();    
}

function filterList(filteredStudents){


    if (settings.filterBy === "expelled"){
        return allStudents.filter(filterByExpelled);   
     }else if (settings.filterBy === "Slytherin"){
         filteredStudents = allStudents.filter(filterBySlytherin);    
     }else if (settings.filterBy === "Hufflepuff"){
         filteredStudents = allStudents.filter(filterByHufflepuff);    
     }else if (settings.filterBy === "Ravenclaw"){
         filteredStudents = allStudents.filter(filterByRavenclaw);    
     }else if (settings.filterBy === "Gryffindor"){
         filteredStudents = allStudents.filter(filterByGryffindor);    
     }else if (settings.filterBy === "non_expelled"){
         filteredStudents = allStudents.filter(filterByNonExpelled);    
     }else if (settings.filterBy === "prefects"){
        filteredStudents = allStudents.filter(filterByPrefect);    
    }else if (settings.filterBy === "squad"){
        filteredStudents = allStudents.filter(filterBySquad);    
    }else if (settings.filterBy === "full_blood"){
        filteredStudents = allStudents.filter(filterByPureBlood);    
    }else if (settings.filterBy === "half_blood"){
        filteredStudents = allStudents.filter(filterByHalfBlood);    
    }else if (settings.filterBy === "muggle"){
        filteredStudents = allStudents.filter(filterByMuggles);    
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
function filterByRavenclaw(student) {
    return student.house === "Ravenclaw";
}
function filterByExpelled(student) {
    return student.expelled === true;
}
function filterByNonExpelled(student) {
    return student.expelled === false;
}
function filterByPrefect(student) {
    return student.prefect === true;
}
function filterBySquad(student) {
    return student.squad === true;
}
function filterByPureBlood(student) {
    return student.bloodStatus === "pure";
}
function filterByHalfBlood(student) {
    return student.bloodStatus === "half-blood";
}
function filterByMuggles(student) {
    return student.bloodStatus === "muggle";
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
    const popup = document.querySelector(".popup");
    popup.style.display = "block";

    // SHOW STUDENT INFO
    document.querySelector(".popup h3").textContent = student.firstName + " " + student.lastName;
    document.querySelector(".first_name").textContent = "First name:" + " " + student.firstName;
    document.querySelector(".last_name").textContent = "Last name:" + " " + student.lastName;
    if (student.middleName === " " || student.middleName === "") {
        document.querySelector(".middle_name").textContent = student.middleName;
    } else {
        document.querySelector(".middle_name").textContent = "Middle name:" + " " + student.middleName;
    }
    if (student.nickName === "") {
        document.querySelector(".nick_name").textContent = student.nickName;
    } else {
        document.querySelector(".nick_name").textContent = "Nick name:" + " " + student.nickName;
    }
    document.querySelector(".house").textContent = "House:" + " " +student.house;
    
    document.querySelector(".blood_status").textContent = "Blood status:" + " " +student.bloodStatus;
    if (student.prefect === false){
        document.querySelector(".prefect").textContent = "Prefect:" + " " + "No";
    }else {
        document.querySelector(".prefect").textContent = "Prefect:" + " " +"Yes";
    }

    // SHOW PIC OF STUDENT
    document.querySelector(".student_img").src = student.imgSrc;

    // EXPEL STUDENTS
    document.querySelector(".expel_student").textContent = "Expel" + " " + student.firstName;
    document.querySelector(".expel_student").addEventListener("click", () => expelStudent(student));
    if (student.expelled === true) {

    document.querySelector(".expel_student").classList.add("hide");
    }

    

    // THE INQUISITORIAL SQUAD
    document.querySelector(".squad_member").textContent = "Inquisitorial squad:" + " " + "No";
    if (student.squad === true){
        document.querySelector(".squad_member").textContent = "Inquisitorial squad:" + " " + "yes";
    }

  // CHANGE COLOR THEMES
    if (student.house === "Gryffindor") {
        document.querySelector(".popup").style.backgroundColor = "red";
        document.querySelector(".popup .crest").src = "assets/Gryffindor.svg";
    }else if (student.house === "Slytherin") {
        document.querySelector(".popup").style.backgroundColor = "green";
        document.querySelector(".popup .crest").src = "assets/Slytherin.svg";
    }else if (student.house === "Hufflepuff") {
        document.querySelector(".popup").style.color = "white";
        document.querySelector(".popup").style.backgroundColor = "black";
        document.querySelector(".popup .crest").src = "assets/Hufflepuff.svg";
    }else if (student.house === "Ravenclaw") {
        document.querySelector(".popup").style.backgroundColor = "blue";
        document.querySelector(".popup .crest").src = "assets/Rawenclaw.svg";
    }  
};

document.querySelector(".closePopup").addEventListener("click", CloseThePopup);


function CloseThePopup(){
    document.querySelector(".popup").style.display = "none";
  };


//........................EXPELLED STATUS........................//


function expelStudent(student) {
    if (student.firstName === "Asefeh") {
        alert("Do NOT even try to expel ME!");
        student.expelled = false ;
        CloseThePopup();
        buildList();
    }else if (confirm(`Do you want to expel ${student.firstName}?`)) {
        student.expelled = true ;
        student.prefect= false;
        student.squad= false;
        CloseThePopup();
        buildList();
    }
}



function hackTheSystem() {
    allStudents.push(myArray);
    console.log("I solemnly swear that I am up to no good");
    buildList();
    document.querySelector("body").style.backgroundColor= "lightpink";
}
