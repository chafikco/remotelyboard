//Typewriter header
$(document).ready(function () {
  typeWriter();
});

var i = 0;
var txt = "The remote job aggregate."; /* The text */
var speed = 80; /* The speed/duration of the effect in milliseconds */

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("subHeader").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

//Calls all WWR RSS URL's because they're seperate categories
rssCallWWR("https://weworkremotely.com/categories/remote-programming-jobs.rss");
rssCallWWR("https://weworkremotely.com/categories/remote-design-jobs.rss");
rssCallWWR("https://weworkremotely.com/categories/remote-copywriting-jobs.rss");
rssCallWWR(
  "https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss"
);
rssCallWWR(
  "https://weworkremotely.com/categories/remote-business-and-management-jobs.rss"
);
rssCallWWR(
  "https://weworkremotely.com/categories/remote-customer-support-jobs.rss"
);
rssCallWWR(
  "https://weworkremotely.com/categories/remote-sales-and-marketing-jobs.rss"
);
rssCallWWR("https://weworkremotely.com/categories/remote-product-jobs.rss");

//Remoteok.io API
const RemoteokUrl = "https://remoteok.io/api";
fetch(RemoteokUrl)
  .then((response) => response.json())
  .then((contents) => {
    const items = contents;
    let html = "";
    for (var i = 0; i < items.length; i++) {
      if (items[i].position != null) {
        var dateValue = items[i].date.substring(0, 10);
        var tags = items[i].tags.join(", ");
        html += `
    <li class="remoteok autosort" data-date="${dateValue}"><a href="${items[i].url}" target="_blank" rel="noopener">
      <article>
        <h2>
            ${items[i].position}
        </h2>
        <h4>
            ${items[i].company}
        </h4>
        <p class="titleCard">
        <b>Posted on:</b> ${dateValue}<br><br>
        <b>Skills required:</b> ${tags}
        </p>
      </article>
      </a></li>
    `;
      } else {
        console.log("Dead link");
      }
    }
    var jobListings = document.getElementById("jobPosts");
    jobListings.insertAdjacentHTML("beforeend", html);
  });

//Remotive API
const proxyurl = "https://cors-anywhere.herokuapp.com/"; // site that doesn’t send Access-Control-*
const url = "https://remotive.io/api/remote-jobs"; // site that doesn’t send Access-Control-*
fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
  .then((response) => response.json())
  .then((contents) => {
    const items = contents.jobs;
    let html = "";
    for (var i = 0; i < items.length; i++) {
      var dateValue = items[i].publication_date.substring(0, 10);
      var tags = items[i].tags.join(", ");
      html += `
        <li class="remotive autosort" data-date="${dateValue}"><a href="${
        items[i].url
      }" target="_blank" rel="noopener">
          <article>
            <h2>
                ${items[i].title}
            </h2>
            <h4>
                ${items[i].company_name} <b>${
        items[i].candidate_required_location != ""
          ? "/ " + items[i].candidate_required_location
          : ""
      }</b>
            </h4>
            <p class="titleCard">
            <b>Posted on:</b> ${dateValue}<br><br>
            <b>Skills required:</b> ${tags}
            </p>
          </article>
          </a></li>
        `;
    }
    var jobListings = document.getElementById("jobPosts");
    jobListings.insertAdjacentHTML("beforeend", html);
  });

//WWR RRS feeds - create function that replicates the same for each category
function rssCallWWR(RSS_URL) {
  fetch(RSS_URL)
    .then((response) => response.text())
    .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
    .then((data) => {
      console.log(data);
      const items = data.querySelectorAll("item");
      let html = ``;
      items.forEach((el) => {
        var dateHold = el.querySelector("pubDate").innerHTML;
        var year = dateHold.substr(12, 4);
        var mon = dateHold.substr(8, 3).toLowerCase();
        var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        mon = months.indexOf(mon)+1;
        var day = dateHold.substr(5, 2);
        var dateValue = year + "-" + mon + "-" + day;
        html += `
        <li class="wwr autosort" data-date="${dateValue}"><a href="${
          el.querySelector("link").innerHTML
        }" target="_blank" rel="noopener">
        <article>
        <h2>
            ${el.querySelector("title").innerHTML.replace(/(.*)\:/, "")}
        </h2>
        <h4>
            ${el.querySelector("title").innerHTML.replace(/\:(.*)/, "")}
        </h4>
        <p class="titleCard">
        <b>Posted on</b> ${dateValue}
        </p>
        </article>
        </a></li>
      `;
      });
      var jobListings = document.getElementById("jobPosts");
      jobListings.insertAdjacentHTML("beforeend", html);
    });
}

//Filter search bar
function filterJobs(filterSource) {
  //filterSource variable comes from the below filter choice in the drop down.
  //I use this to then determine if the search needs to be filtered to only those selections.
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("jobSearch");
  filter = input.value.toUpperCase();
  ul = document.getElementById("jobPosts");
  li = ul.getElementsByTagName("li");

  // Loop through all list items, and hide those who don't match the search query
  //This also checks if the dropdownb filter was selected, and if so, only return li's with the filter class name
  if (filterSource) {
    liFilter = document.getElementsByClassName(filterSource);
    for (i = 0; i < liFilter.length; i++) {
      a = liFilter[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        liFilter[i].style.display = "";
      } else {
        liFilter[i].style.display = "none";
      }
    }
  } else {
    //otherwise return everything from the search results
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }
}

//Dropdown filter for job board type - onClick
function changeSource(source) {
  if (source == "remotive") {
    $(".remotive").show();
    $(".wwr").hide();
    $(".remoteok").hide();
    //changes the placeholder value for the dropdown
    $(".dropButton").text("Remotive.io");
    //this updates the search bar to return only posts in this filter category
    $("#jobSearch").attr("onkeyup", 'filterJobs("remotive")');
    filterJobs("remotive");
  } else if (source == "remoteok") {
    $(".remoteok").show();
    $(".wwr").hide();
    $(".remotive").hide();
    //changes the placeholder value for the dropdown
    $(".dropButton").text("Remoteok.io");
    //this updates the search bar to return only posts in this filter category
    $("#jobSearch").attr("onkeyup", 'filterJobs("remoteok")');
    filterJobs("remoteok");
  } else if (source == "wwr") {
    $(".wwr").show();
    $(".remotive").hide();
    $(".remoteok").hide();
    //changes the placeholder value for the dropdown
    $(".dropButton").text("We Work Remotely");
    //this updates the search bar to return only posts in this filter category
    $("#jobSearch").attr("onkeyup", 'filterJobs("wwr")');
    filterJobs("wwr");
  } else {
    $(".wwr").show();
    $(".remotive").show();
    $(".remoteok").show();
    //changes the placeholder value for the dropdown
    $(".dropButton").text("Job Board");
    //this updates the search bar to return only posts in this filter category
    $("#jobSearch").val(null);
    $("#jobSearch").attr("onkeyup", 'filterJobs("")');
    filterJobs("");
  }
}

//order by date decending - everything with class "autosort" will be sorted. Set a delay to find old order
setTimeout(function() {
  // Now sort them
  var post = $("#jobPosts");
  var posts = post.children('.autosort').detach().get();
  posts.sort(function(a, b) {
    return new Date($(b).data("date")) - new Date($(a).data("date"));
  });
  post.append(posts);
}, 2000);

//on click animate the about and contact boxes
function openBox(button) {
  if (button === "about") {
    $(".aboutBox").css("opacity", "100");
  } else {
    $(".contactBox").css("opacity", "100");
  }
}
