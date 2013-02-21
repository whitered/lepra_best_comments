// ==UserScript==
// @name           Lepra Best Comments Link
// @namespace      ru.whitered
// @include        http://leprosorium.ru/*
// @include        http://*.leprosorium.ru/*
// @version        1.0
// ==/UserScript==

function getElementByXPath(expr, node)
{
  return document.evaluate(expr, node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}



function getElementsByClass(searchClass, node, tag)
{
  if(tag == null) tag = "*";

  var classElements = [];
  var els = node.getElementsByTagName(tag);
  var elsLen = els.length;
  var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");

  for(var i = 0; i < elsLen; i++)
  {
    if(pattern.test(els[i].className))
    {
      classElements.push(els[i]);
    }
  }

  return classElements;
}



function createLink(url, text, title)
{
  var link = document.createElement('a');
  link.href = url;
  link.innerHTML = text;
  link.setAttribute("title", title);
  return link;
}



function appendLink(link, node)
{
  node.appendChild(document.createTextNode(" | "));
  node.appendChild(link);
}



function updatePost(url, best)
{
  var link;
  if(best)
  {
    link = createLink(url, "по дате", "сортировать комментарии по дате");
  }
  else
  {
    link = createLink(url + "/best", "по рейтингу", "сортировать комментарии по рейтингу");
  }

  var node = getElementByXPath(".//div[@class = 'p']", document.getElementById("navigation"));
  appendLink(link, node);
}



function updateIndex()
{
  var posts = getElementsByClass("post", document, "div");
  for(var i = 0; i <= posts.length; i++)
  {
    var post = posts[i];
    var links = getElementByXPath(".//div[@class='p']", post);
    var url = getElementByXPath(".//a[contains(@href, '/comments/')]", links).getAttribute("href");
    var link = createLink(url + "/best", "лучшее", "показать лучшие комментарии");
    appendLink(link, links);
  }
}



var match = location.pathname.match(/(\/comments\/\d+)?\/?(best)?/);

if(match[1])
{
  updatePost(match[1], match[2]);
}
else
{
  updateIndex();
}
