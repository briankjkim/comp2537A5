function loadEvents() {
    $.ajax({
        url: "/admin/getAllUsers",
        type: "get",
        success: (data) => {
            console.log("admin GET request sent")
            console.log(data);
            for (i = 0; i < data.length; i++) {

                $("main").append(
                    `
                <div class="user_container"> 
                    Username - ${data[i].username}
                <br> 
                    User uID- ${data[i]._id}
                <br> 
                    Admin status - ${data[i].admin}
                <br>
                    User age - ${data[i].age}
                <br>
                    <button class="incage" id="${data[i]["_id"]}">Add age</button>
                <br>
                    <button class="removeButton" id="${data[i]["_id"]}">Delete this, nephew!</button>
                </div>
                
                `
                )
            }
        }
    })
}


function incAge(){
    x = this.id
    $.ajax({
        url:`/admin/update/${x}`,
        type:"get",
        success: (server_response)=>{console.log(server_response)}
    })
}


function removeUser(){
    x = this.id
    $.ajax({
        url:`/admin/remove/${x}`,
        type:"get",
        success: (server_response)=>{console.log(server_response)}
    })
}


function setup() {
    loadEvents()

    $("body").on('click', '.incage', incAge)
    $("body").on('click', '.removeButton', removeUser)
}

$(document).ready(setup)