testBtn.addEventListener('click', async function(){
    var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //     // Typical action to be performed when the document is ready:
    //     // document.getElementById("demo").innerHTML = xhttp.responseText;
    //     console.log(xhttp.responseText);
    //     }
    // };
    // xhttp.open("GET", "/list", true);
    // xhttp.send();

    let obj=await fetch('/list');
    let data = await obj.json();

    let displayData = 
    `<thead>
        <td>ID</td>
        <td>Title</td>
        <td>Writer</td>
    </thead>
    <tbody>`;

        
    data.forEach((item,index) => {
        displayData +=
            `<tr>
                <td>${item.id}</td>
                <td><a href="#" id="triggerModal" data-bs-toggle="modal" data-bs-target="#customModal" data-item-id="${index}">${item.title}</a></td>
                <td>${item.writer}</td>
            </tr>`
    });

    displayData += `</tbody>`;
    
    document.getElementById("datatablesSimple").innerHTML = displayData;
});

addDataBtn.addEventListener('click', async function(){
    var xhttp = new XMLHttpRequest();
    let obj=await fetch('/a');
    let data = await obj.json();
    var itemId = this.getAttribute('data-item-id');

    let displayData = ``

        
    data.forEach((item,index) => {
        displayData +=
            `<tr>
                <td>${item.content}</td>
                <td>${itemId}</td>
            </tr>`
    });

    displayData += `</tbody>`;
    
    document.getElementById("modalText").innerHTML = displayData;
});