<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="functions" uri="http://www.jahia.org/tags/functions" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="graphql" uri="http://www.jahia.org/graphql-dxm-provider/functions" %>
<%--@elvariable id="currentNode" type="org.jahia.services.content.JCRNodeWrapper"--%>
<%--@elvariable id="out" type="java.io.PrintWriter"--%>
<%--@elvariable id="script" type="org.jahia.services.render.scripting.Script"--%>
<%--@elvariable id="scriptInfo" type="java.lang.String"--%>
<%--@elvariable id="workspace" type="java.lang.String"--%>
<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="currentResource" type="org.jahia.services.render.Resource"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>
<c:set var="context" value="${pageContext.request.contextPath}" />
<c:set var="currentNode" value="${pageContext.request.contextPath}" />
<c:set var="targetId" value="tools-container"/>

<html>
<head>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/modules/sdl-generator-tools/css/main.css"
          type="text/css"/>
</head>

<script src="${context}/modules/sdl-generator-tools/javascript/apps/sdlGeneratorTools.js" ></script>
<script src="${context}/modules/sdl-generator-tools/javascript/apps/vendors.js" ></script>

<body>

<div id="${targetId}">loading..</div>
<script>
    (function() {
        "use strict";
        const contextJsParameters = {};
        contextJsParameters['servletContext'] = '${url.context}';
        contextJsParameters['contextPath'] = '${pageContext.request.contextPath}';

        sdlGeneratorToolsReactRender('${targetId}', contextJsParameters);
    })();
</script>
</body>
</html>