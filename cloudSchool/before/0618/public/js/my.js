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
    </thead>
    <tbody>`;

        
    data.forEach((item,index) => {
        displayData +=
            `<tr>
                <td>${item.id}</td>
                <td>${item.title}</td>
            </tr>`
    });

    displayData += `</tbody>`;
    
    document.getElementById("datatablesSimple").innerHTML = displayData;
}); 