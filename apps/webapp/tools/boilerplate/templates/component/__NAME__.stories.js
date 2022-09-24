import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import { propKnobs } from '../../../storybook/util/PropKnobs.js';

import __NAME__ from './__NAME__.jsx';

storiesOf('__NAME__', module)
    .addDecorator(withKnobs)
    .add('playground', () => (
        <__NAME__
            {...propKnobs(__NAME__, 'Props', 3)}
            {...propKnobs(__NAME__, 'HTML Attributes', 0, 3)}/>
    ));
