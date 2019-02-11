<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="functions" uri="http://www.jahia.org/tags/functions" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="graphql" uri="http://www.jahia.org/graphql-dxm-provider/functions" %>

<c:set var="targetId" value="tools-container"/>

<html>
<head>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/modules/sdl-generator-tools/css/sdl-generator-tools.css"
          type="text/css"/>
</head>

<script src="${pageContext.request.contextPath}/modules/sdl-generator-tools/javascript/apps/sdlGeneratorTools.js" ></script>

<body>

<div id="${targetId}">loading..</div>
<script>
    "use strict";
    document.addEventListener('DOMContentLoaded', function() {
        console.log(window.sdlGeneratorToolsReactRender);
        
        const contextJsParameters = {};
        contextJsParameters['servletContext'] = '${url.context}';
        contextJsParameters['contextPath'] = '${url.context}';

        sdlGeneratorToolsReactRender('${targetId}', contextJsParameters);
    }, false);
</script>
</div>
</body>
</html>