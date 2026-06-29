const productBox = document.getElementById("productBox");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productCate = document.getElementById("productCate");
const productDesc = document.getElementById("productDesc");
const productCurrency = document.getElementById("currency");
const productImage = document.getElementById("productImage");
const searchInput = document.getElementById("search");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const cancelBtn = document.getElementById("cancelBtn");
const filterBtn = document.getElementById("filterBtn");
const filterDiv = document.getElementById("filterDiv");
const filterMinPrice = document.getElementById("filterMinPrice");
const filterMaxPrice = document.getElementById("filterMaxPrice");
const applyFilterBtn = document.getElementById("applyFilter");
const clearBtn = document.getElementById("clearBtn");
var currentIndex = null;


let productList = [];
if (localStorage.getItem("productList")) {
  productList = JSON.parse(localStorage.getItem("productList"));
  retrieveProducts(productList);
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // const imageUrl = URL.createObjectURL(productImage.files[0]);

  let imageUrl = "";
  const image = productImage.files[0];
  const product = {
        name: productName.value,
        price: productPrice.value,
        categorey: productCate.value,
        desciption: productDesc.value,
        currency: productCurrency.value,
        // image: productImage.value.split("\\").slice(-1).toString(),
        image: image,
      };
  if(image&&product.name&&product.categorey&&product.desciption&&product.price){
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = function () {
      const imageBase64 = reader.result;
      imageUrl = imageBase64;
      product.image=imageUrl;
      productList.push(product);
  
      try {
        window.localStorage.setItem("productList", JSON.stringify(productList));
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Product has been created successfully!",
            showConfirmButton: false,
            timer: 1500
          });
        retrieveProducts(productList);
        clearForm();
      } catch (error) {
        if (error.name == "QuotaExceededError") {
          productList.pop();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "You reached the maximum memorey storage!",
            footer: "<a href=\"#\">let's Try with other image...</a>"
          });
        } else {
         Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error, Please try again!",
          });
        }
      }
    };
  }else{
         Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill details :(",
          });
  }
});

function clearForm() {
  productName.value = null;
  productDesc.value = null;
  productPrice.value = null;
  productCate.value = "electronics";
  productImage.value = null;
}
function retrieveProducts(products) {
  productBox.innerHTML = !products.length?`
  <div class="col-span-12 flex flex-col items-center justify-center gap-1 relative">
         <img src="./Images/emptylist.png" alt="">
          <div class="text-center space-y-2 absolute top-4/5">
          <h2 class="text-5xl font-mono" >Ooops! It's Empty</h2>
          <p class="text-lg font-sans text-gray-700 " >Looks like You don't have anything in your list</p>
          </div>
  </div>
  `:'';
  products.map((product, index) => {
    productBox.innerHTML += `<div class=" col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 p-3  border flex flex-col rounded-lg border-black/20">
                <img src="${product.image}" alt="" class="h-64 object-contain mx-auto w-full">
            <div class="space-y-1 ">
              <h2 class="text-3xl font-semibold line-clamp-1">${product.name}</h2>
              <div class="relative group/desc">
              <span class="text-lg line-clamp-2 cursor-pointer ">${product.desciption}</span>
              <span class="text-lg absolute border transition-all shadow p-2 group-hover/desc:delay-500 group-hover/desc:duration-150 invisible opacity-0 group-hover/desc:opacity-100 group-hover/desc:visible group-hover/desc:transition-all rounded-xl w-full left-0 top-1/1 z-999 text-white bg-red-500 ">${product.desciption}</span>
              </div>
              <h3 class="text-xl font-medium">Price: ${product.price} ${product.currency}</h3>
              <h3 class="text-xl font-medium">Category: ${product.categorey}</h3>
            </div>
            <div class="">
              <button onclick="deleteProduct(${index})" class="border cursor-pointer hover:bg-red-700 transition-all delay-150 w-full my-1 py-1 text-white bg-red-600/80 rounded-lg deleteBtn">Delete</button>
              <button onclick="updateProduct(${index})" class="border cursor-pointer hover:bg-amber-600 transition-all delay-150 w-full my-1 py-1 text-white bg-amber-500 rounded-lg">Update</button>
            </div>
          </div>`;
  });
}

function deleteProduct(index) {
  Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {Swal.fire({
    title: "Deleted!",
    text: "Your file has been deleted.",
    icon: "success"
  });
  productList.splice(index, 1);
  localStorage.setItem("productList", JSON.stringify(productList));
  retrieveProducts(productList);
}else if(result.isDismissed){
  Swal.fire({
    title: "Cancelled",
    text: "Your product is safe :)",
    icon: "error"
  });
}
});
}
function updateProduct(index) {
  currentIndex = index;
  productName.value = productList[index].name;
  productPrice.value = productList[index].price;
  productCate.value = productList[index].categorey;
  productDesc.value = productList[index].desciption;
  addBtn.classList.replace("inline", "hidden");
  updateBtn.classList.replace("hidden", "inline");
  cancelBtn.classList.toggle("hidden");
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
updateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let imageUrl = productList[currentIndex].image;

  if (productImage.value) {
    const image = productImage.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = function () {
      const imageBase64 = reader.result;
      imageUrl = imageBase64;

      const product = {
        name: productName.value,
        price: productPrice.value,
        categorey: productCate.value,
        desciption: productDesc.value,
        currency: productCurrency.value,
        // image: productImage.value.split("\\").slice(-1).toString(),
        image: imageUrl,
      };

      productList.splice(currentIndex, 1, product);

      try {
        window.localStorage.setItem("productList", JSON.stringify(productList));
        retrieveProducts(productList);
         Swal.fire({
            title: `${product.name}`,
            text: "Product updated successfully :)",
            imageUrl: `${imageUrl}`,
            imageAlt: `${product.name}`
          });
        clearForm();
        updateBtn.classList.replace("inline", "hidden");
        cancelBtn.classList.toggle("hidden");
        addBtn.classList.replace("hidden", "inline");
      } catch (error) {
        console.log(error);
        if (error.name == "QuotaExceededError") {
          Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "You reached the maximum memorey storage!",
          footer: "<a href=\"#\">let's Try with other image...</a>"
        });
        } else {
          Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error, Please try again!",
        });
        }
      }
    };
  } else {
    const product = {
      name: productName.value,
      price: productPrice.value,
      categorey: productCate.value,
      desciption: productDesc.value,
      currency: productCurrency.value,
      // image: productImage.value.split("\\").slice(-1).toString(),
      image: imageUrl,
    };
    Swal.fire({
      title: `${product.name}`,
      text: "Product updated successfully :)",
      imageUrl: `${imageUrl}`,
      imageAlt: `${product.name}`
    });
    productList.splice(currentIndex, 1, product);
    localStorage.setItem("productList", JSON.stringify(productList));
    retrieveProducts(productList);
    clearForm();
    updateBtn.classList.replace("inline", "hidden");
    addBtn.classList.replace("hidden", "inline");
    cancelBtn.classList.toggle("hidden");
  }
});
cancelBtn.addEventListener("click",(e)=>{
  e.preventDefault();
  clearForm();
  updateBtn.classList.replace("inline", "hidden");
  addBtn.classList.replace("hidden", "inline");
  cancelBtn.classList.toggle("hidden");
  Swal.fire({
    title: "Cancelled",
    text: "Your product is safe :)",
    icon: "error"
  });

})
searchInput.addEventListener("input", () => {
  ApplyFilterAndSearch();
});

filterBtn.addEventListener("click",()=>{
    filterDiv.classList.toggle("invisible");
    filterDiv.classList.toggle("max-h-0");
    filterDiv.classList.toggle("max-h-100");
});

applyFilterBtn.addEventListener("click",()=>{
  ApplyFilterAndSearch();
})
function ApplyFilterAndSearch() {
  let filterCategory = document.querySelector('input[name="searchCate"]:checked').value;
const searchAll = filterCategory=="all";
console.log(filterMinPrice.value);
const maxPrice = filterMaxPrice.value?filterMaxPrice.value:filterMaxPrice.max;
const minPrice = filterMinPrice.value?filterMinPrice.value:filterMinPrice.min;
const filterdList = [];
const searchWord = searchInput.value.toLowerCase();
productList.map(product=>{
  console.log(filterCategory);
  console.log(searchAll);
  
    product.name.toLowerCase().includes(searchWord)
    &&Number(product.price)<=Number(maxPrice)
    &&Number(product.price)>=Number(minPrice)
    &&(searchAll?true:product.categorey==filterCategory)?
    filterdList.push(product):false; 
})
console.log(filterdList);

retrieveProducts(filterdList);
}
clearBtn.addEventListener("click",()=>{
  filterMaxPrice.value=null;
  filterMinPrice.value=null;
  document.getElementById("all").checked=true;
});