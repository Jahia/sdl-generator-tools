import React, {Suspense} from 'react';
import {registry} from '@jahia/ui-extender';
import {sdlRedux} from './App.redux';
import {SdLgenerator} from '@jahia/moonstone';
import {ProgressPaper} from '@jahia/design-system-kit';

const Component = React.lazy(() => import('./MainLayout'));

window.jahia.i18n.loadNamespaces('sdl-generator-tools');

registry.add('adminRoute', 'sdlGeneratorTools', {
    targets: ['developerTools:40'],
    icon: <SdLgenerator/>,
    requiredPermission: 'developerToolsAccess',
    label: 'sdl-generator-tools:label.sdlGeneratorTools.top.caption',
    isSelectable: true,
    render: () => <Suspense fallback={<ProgressPaper/>}><Component/></Suspense>
});

sdlRedux(registry);
