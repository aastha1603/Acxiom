
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify([
    { email:"admin@gmail.com", password:"123", role:"admin" }
  ]));
}


function login(){
  const email=document.getElementById("email").value;
  const pass=document.getElementById("password").value;
  if(!email||!pass) return alert("All fields required");

  const users=JSON.parse(localStorage.getItem("users"));
  const user=users.find(u=>u.email===email&&u.password===pass);
  if(!user) return alert("Invalid Credentials");

  sessionStorage.setItem("user",JSON.stringify(user));
  if(user.role==="admin") location="admin.html";
  else if(user.role==="vendor") location="vendor.html";
  else location="user.html";
}

function signup(role){
  const email=signupEmail.value;
  const pass=signupPassword.value;
  if(!email||!pass) return alert("All fields required");

  let users=JSON.parse(localStorage.getItem("users"));
  if(users.find(u=>u.email===email)) return alert("Email exists");

  users.push({email,password:pass,role});
  localStorage.setItem("users",JSON.stringify(users));
  alert(role+" registered");
  location="login.html";
}

function protectPage(role){
  const user=JSON.parse(sessionStorage.getItem("user"));
  if(!user||user.role!==role){
    alert("Access Denied");
    location="login.html";
  }
}

function logout(){
  sessionStorage.clear();
  location="login.html";
}


function addMembership(){
  const name=vendorName.value;
  const duration=document.querySelector('input[name="duration"]:checked').value;
  if(!name) return alert("Vendor required");

  let m=JSON.parse(localStorage.getItem("memberships"))||[];
  m.push({vendor:name,duration});
  localStorage.setItem("memberships",JSON.stringify(m));
  alert("Membership Added");
}

function updateMembership(){
  const name=vendorName.value;
  const duration=document.querySelector('input[name="duration"]:checked').value;

  let m=JSON.parse(localStorage.getItem("memberships"))||[];
  m=m.map(x=>{if(x.vendor===name)x.duration=duration;return x});
  localStorage.setItem("memberships",JSON.stringify(m));
  alert("Membership Updated");
}

function addUser(){
  const email=newUserEmail.value;
  const pass=newUserPassword.value;
  if(!email||!pass)return alert("All fields required");

  let users=JSON.parse(localStorage.getItem("users"));
  users.push({email,password:pass,role:"user"});
  localStorage.setItem("users",JSON.stringify(users));
  displayUsers();
}

function deleteUser(email){
  let users=JSON.parse(localStorage.getItem("users"));
  users=users.filter(u=>!(u.email===email&&u.role==="user"));
  localStorage.setItem("users",JSON.stringify(users));
  displayUsers();
}

function displayUsers(){
  const div=document.getElementById("userList");
  if(!div)return;
  const users=JSON.parse(localStorage.getItem("users"));
  div.innerHTML="";
  users.filter(u=>u.role==="user")
    .forEach(u=>div.innerHTML+=
      `<div>${u.email} 
       <button onclick="deleteUser('${u.email}')">Delete</button>
       </div>`);
}

function addVendor(){
  const email=newVendorEmail.value;
  const pass=newVendorPassword.value;
  if(!email||!pass)return alert("All fields required");

  let users=JSON.parse(localStorage.getItem("users"));
  users.push({email,password:pass,role:"vendor"});
  localStorage.setItem("users",JSON.stringify(users));
  displayVendors();
}

function deleteVendor(email){
  let users=JSON.parse(localStorage.getItem("users"));
  users=users.filter(u=>!(u.email===email&&u.role==="vendor"));
  localStorage.setItem("users",JSON.stringify(users));
  displayVendors();
}

function displayVendors(){
  const div=document.getElementById("vendorList");
  if(!div)return;
  const users=JSON.parse(localStorage.getItem("users"));
  div.innerHTML="";
  users.filter(u=>u.role==="vendor")
    .forEach(u=>div.innerHTML+=
      `<div>${u.email}
       <button onclick="deleteVendor('${u.email}')">Delete</button>
       </div>`);
}

function generateReports(){
  const div=document.getElementById("reportData");
  const users=JSON.parse(localStorage.getItem("users"))||[];
  const products=JSON.parse(localStorage.getItem("products"))||[];
  const orders=JSON.parse(localStorage.getItem("orders"))||[];

  div.innerHTML=`
  <p>Total Users: ${users.filter(u=>u.role==="user").length}</p>
  <p>Total Vendors: ${users.filter(u=>u.role==="vendor").length}</p>
  <p>Total Products: ${products.length}</p>
  <p>Total Orders: ${orders.length}</p>`;
}

function displayTransactions(){
  const div=document.getElementById("transactionList");
  if(!div)return;
  const orders=JSON.parse(localStorage.getItem("orders"))||[];
  div.innerHTML="";
  orders.forEach(o=>{
    div.innerHTML+=`<div>Order ${o.id} | ₹${o.total} | ${o.status}</div><hr>`;
  });
}


function addProduct(){
  const name=productName.value;
  const price=productPrice.value;
  if(!name||!price)return alert("All fields required");

  let p=JSON.parse(localStorage.getItem("products"))||[];
  p.push({id:Date.now(),name,price,status:"Received"});
  localStorage.setItem("products",JSON.stringify(p));
  displayProducts();
}

function deleteProduct(id){
  let p=JSON.parse(localStorage.getItem("products"));
  p=p.filter(x=>x.id!==id);
  localStorage.setItem("products",JSON.stringify(p));
  displayProducts();
}

function updateStatus(id){
  let p=JSON.parse(localStorage.getItem("products"));
  p=p.map(x=>{
    if(x.id===id){
      if(x.status==="Received")x.status="Ready for Shipping";
      else if(x.status==="Ready for Shipping")x.status="Out for Delivery";
      else x.status="Delivered";
    }
    return x;
  });
  localStorage.setItem("products",JSON.stringify(p));
  displayProducts();
}

function displayProducts(user=false){
  const div=document.getElementById("productList");
  if(!div)return;
  const p=JSON.parse(localStorage.getItem("products"))||[];
  div.innerHTML="";
  p.forEach(x=>{
    div.innerHTML+=`
    <div>
    ${x.name} - ₹${x.price} - ${x.status}
    ${user?
      `<button onclick="addToCart(${x.id})">Add</button>`:
      `<button onclick="deleteProduct(${x.id})">Delete</button>
       <button onclick="updateStatus(${x.id})">Update Status</button>`}
    </div><hr>`;
  });
}


function addToCart(id){
  let cart=JSON.parse(localStorage.getItem("cart"))||[];
  cart.push(id);
  localStorage.setItem("cart",JSON.stringify(cart));
  alert("Added");
}

function displayCart(){
  const div=document.getElementById("cartItems");
  const totalDiv=document.getElementById("total");
  const cart=JSON.parse(localStorage.getItem("cart"))||[];
  const p=JSON.parse(localStorage.getItem("products"))||[];
  let total=0;
  div.innerHTML="";
  cart.forEach(id=>{
    const item=p.find(x=>x.id===id);
    if(item){
      total+=Number(item.price);
      div.innerHTML+=`
      <div>${item.name}-₹${item.price}
      <button onclick="cancelItem(${item.id})">Cancel</button>
      </div>`;
    }
  });
  totalDiv.innerText="Total: ₹"+total;
  localStorage.setItem("finalTotal",total);
}

function cancelItem(id){
  let cart=JSON.parse(localStorage.getItem("cart"));
  cart=cart.filter(x=>x!==id);
  localStorage.setItem("cart",JSON.stringify(cart));
  displayCart();
}


function placeOrder(){
  const name=document.getElementById("name").value;
  const email=document.getElementById("emailCheck").value;
  if(!name||!email)return alert("All fields required");

  let o=JSON.parse(localStorage.getItem("orders"))||[];
  o.push({id:Date.now(),total:localStorage.getItem("finalTotal"),status:"Order Placed"});
  localStorage.setItem("orders",JSON.stringify(o));
  localStorage.removeItem("cart");
  location="success.html";
}

function displayOrders(){
  const div=document.getElementById("orderList");
  if(!div)return;
  const o=JSON.parse(localStorage.getItem("orders"))||[];
  div.innerHTML="";
  o.forEach(x=>{
    div.innerHTML+=`<div>Order ${x.id} | ₹${x.total} | ${x.status}</div><hr>`;
  });
}


function addGuest(){
  const name=guestName.value;
  if(!name)return alert("Enter name");
  let g=JSON.parse(localStorage.getItem("guests"))||[];
  g.push(name);
  localStorage.setItem("guests",JSON.stringify(g));
  displayGuests();
}

function deleteGuest(name){
  let g=JSON.parse(localStorage.getItem("guests"));
  g=g.filter(x=>x!==name);
  localStorage.setItem("guests",JSON.stringify(g));
  displayGuests();
}

function displayGuests(){
  const div=document.getElementById("guestList");
  if(!div)return;
  const g=JSON.parse(localStorage.getItem("guests"))||[];
  div.innerHTML="";
  g.forEach(x=>{
    div.innerHTML+=`<div>${x} 
    <button onclick="deleteGuest('${x}')">Delete</button></div>`;
  });
}


