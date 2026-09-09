document.addEventListener("DOMContentLoaded",()=>{
  let cars=[
    {id:1,brand:"Audi",image:"assets/car1.png",price:2000,qty:3},
    {id:2,brand:"Polo",image:"assets/car2.png",price:3000,qty:4},
    {id:3,brand:"Lamborghini",image:"assets/car3.png",price:5000,qty:5},
    {id:4,brand:"Ferrari",image:"assets/car4.png",price:6000,qty:8},
    {id:5,brand:"Jaguar",image:"assets/car5.png",price:9000,qty:2},    
  ];

  let editIndex=null;
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click",()=>{
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    if (isDark) {
      themeToggle.innerHTML='<i class="fa-solid fa-sun"></i> Light Mode';
      themeToggle.classList.remove("btn-dark");
      themeToggle.classList.add("btn-light");
    }
    else {
      themeToggle.innerHTML ='<i class="fa-solid fa-moon"></i> Dark Mode';
      themeToggle.classList.remove("btn-light");
      themeToggle.classList.add("btn-dark");
    }
  });
  
  function renderCars(){
    const root=document.getElementById("root");
    const searchValue=document.getElementById("searchValue").value.toLowerCase();
    const filteredCars=cars.filter(car=>car.brand.toLowerCase().includes(searchValue));
    root.innerHTML=filteredCars.map((item)=>{
      const originalIndex=cars.findIndex(car=>car.id===item.id);
      return `
        <tr>
          <td>${item.id}</td>
          <td>${item.brand}</td>
          <td>
            <img src="${item.image}" width="60" height="60" class="rounded">
          </td>
          <td>&#8377;${item.price}</td>
          <td>
            <i class="fa-solid fa-minus text-danger" data-index="${originalIndex}" data-action="decr"></i>
            <strong class="mx-2">${item.qty}</strong>
            <i class="fa-solid fa-plus text-success" data-index="${originalIndex}" data-action="incr"></i>
          </td>
          <td>&#8377;${(item.price * item.qty).toFixed(2)}</td>
          <td>
            <i class="fa-solid fa-pen-to-square text-primary" data-index="${originalIndex}" data-action="edit"></i>
          </td>
          <td>
            <i class="fa-solid fa-trash text-danger" data-index="${originalIndex}" data-action="delete"></i>
          </td>
        </tr>
      `;
    }).join("");
    grandTotal();
  }

  function grandTotal(){
    const total=cars.reduce((sum,car)=>{
      return sum+car.price*car.qty;
    }, 0);
    document.getElementById("GrandTotal").innerHTML=`&#8377;${total.toFixed(2)}`;
  }
  renderCars();

  document.getElementById("root").addEventListener("click",(e)=>{
    const index=Number(e.target.dataset.index);
    const action=e.target.dataset.action;
    if(action==="incr"){
      cars[index].qty++;
    }
    else if(action==="decr"){
      if(cars[index].qty > 0){
        cars[index].qty--;
      }
    }
    else if(action==="delete"){
      if(confirm("Delete this car?")){
        cars.splice(index, 1);
      }
    }
    else if(action==="edit"){
      const car=cars[index];
      document.getElementById("carbrand").value=car.brand;
      document.getElementById("carimage").value=car.image;
      document.getElementById("carprice").value=car.price;
      document.getElementById("carqty").value=car.qty;
      editIndex=index;
      const modal=new bootstrap.Modal(
        document.getElementById("exampleModal")
      );
      modal.show();
    }
    renderCars();
  });
  document.getElementById("searchValue").addEventListener("input",renderCars);
  document.getElementById("carform").addEventListener("submit",(e) =>{
    e.preventDefault();
    const brand=document.getElementById("carbrand").value.trim();
    const image=document.getElementById("carimage").value.trim();
    const price=parseFloat(document.getElementById("carprice").value);
    const qty=parseInt(document.getElementById("carqty").value);
    if(!brand || !image || !price || !qty){
      alert("Please fill all fields");
      return;
    }
    if(editIndex!==null){
      cars[editIndex]={...cars[editIndex],brand,image,price,qty};
      editIndex = null;
    }
    else{
      cars.push({id:cars.length?cars[cars.length-1].id+1:1,brand,image,price,qty});
    }
    renderCars();
    document.getElementById("carform").reset();
    const modal=bootstrap.Modal.getInstance(
      document.getElementById("exampleModal")
    );
    modal.hide();
  });
});