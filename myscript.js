var packageId = getPackageId();
var versionHistory = getVersionHistoryElement();

if (packageId)
{
	var query = "https://www.nuget.org/api/v2/Packages()?$orderby=Id&$filter=substringof('{{PACKAGE_ID}}',Dependencies) and IsLatestVersion&$select=Id,Dependencies"
	query = query.replace("{{PACKAGE_ID}}", packageId);
	
	var xmlHttp = new XMLHttpRequest();
	var dependersIds = [];

	sendNugetQuery(query);
}

function sendNugetQuery(nugetQuery)
{
	xmlHttp.open( "GET", nugetQuery, true );
	xmlHttp.setRequestHeader('accept', 'application/json');

	xmlHttp.onload = function() {
		if(xmlHttp.staus == 200) { processResponse(); }
		else { reportProblem(); }
	};
	
	xmlHttp.send(null);
}

function reportProblem(e)
{
	var problem = document.createElement("p");
	problem.id = "dependers";
	problem.innerHTML = "There was a problem with the response from NuGet. Refer to the developer console for additional details.";

	insertDependers(problem);
}

function processResponse()
{
	var nugetResponse = JSON.parse(xmlHttp.responseText);

	dependersIds = getPackageIdsFromResponse(nugetResponse, dependersIds);
	addDependersToPage(dependersIds);

	if (nugetResponse.d.__next)
	{
		sendNugetQuery(nugetResponse.d.__next);
	}
}

function getVersionHistoryElement()
{
	var headings = document.getElementsByTagName("h3");

	for (var i = 0; i < headings.length; i++) {
		if (headings[i].innerHTML == "Version History")
		{
			return headings[i];
		}
	};
}

function generateHeading()
{
	var heading = document.createElement("h3");
	heading.innerHTML = "Dependers";
	heading.id = "dependersSet";

	return heading;	
}

function addDependersToPage(dependersIds)
{
	var dependers = generateDependers(dependersIds);

	insertDependers(dependers)
}

function getPackageIdsFromResponse(nugetResponse, currentIds)
{
	// Assuming response body contains results already sorted by id.

	var ids = currentIds || [];

	for(index = 0; index < nugetResponse.d.results.length; index++)
	{
		if (ids.indexOf(nugetResponse.d.results[index].Id) < 0)
		{
			ids.push(nugetResponse.d.results[index].Id);
		}
	}

	return ids;
}

function insertDependers(dependers)
{
	var packagePage = versionHistory.parentNode;
	var heading = generateHeading();

	var existentHeading = document.getElementById(heading.id);
	if(!existentHeading)
	{
		packagePage.insertBefore(heading, versionHistory);		
	}

	var existentDependers = document.getElementById(dependers.id);
	if(existentDependers)
	{
		for (var i = 0; i < dependers.childNodes.length; i++) {
			existentDependers.appendChild(dependers.childNodes[i]);
		};
	}
	else
	{
		packagePage.insertBefore(dependers, heading.nextSibling);
	}
}

function generateDependers(items)
{
	if (items.length <= 0)
	{
		var empty = document.createElement("p");
		empty.innerHTML = "This package is not used by any other packages.";
		return empty;
	}

	var list = document.createElement("ul");
	
	list.id = "dependers";
	list.className = "dependencySet";

	for(index = 0; index < items.length; index++)
	{
		var item = document.createElement("li");
		var link = document.createElement("a");

		link.href = "/packages/" + items[index];
		link.innerHTML = items[index];

		item.appendChild(link);

		list.appendChild(item);
	}

	return list;
}

function getPackageId()
{
	var packageBadge = document.getElementsByClassName("nuget-badge");
	
	if (packageBadge.length <= 0)
	{
		return;
	}

	packageBadge = packageBadge[0];
	var installCommand = packageBadge.getElementsByTagName("code")[0];

	var COMMAND = "Install-Package ";

	var commandStart = installCommand.innerHTML.indexOf(COMMAND);
	var packageId = installCommand.innerHTML.substr(commandStart + COMMAND.length);

	return packageId.trim();
}