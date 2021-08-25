import * as Stitches from '@stitches/react';
import * as React from 'react';
export const { config, styled } = Stitches.createStitches({
    media: {
        bp1: '',
        bp2: '',
        bp3: '',
        bp4: '',
        bp5: '',
        bp6: '',
        bp8: '',
        bp9: '',
        bp10: ''
    },
    utils: {
        ml: (value) => ({ marginLeft: value }),
    },
    theme: {
        colors: {
            red100: '#ff0000',
        },
    },
});
export const Text = styled('span', {
    background: '$red100'
});
const DEFAULT_TAG = 'h1';
const Heading = React.forwardRef((props, forwardedRef) => {
    return (<>
			{/* types here will be fast */}
			<Text onClick={(e) => { console.log(e.altKey); }} css={props.css}/>
			<Text as={DEFAULT_TAG} onClick={(e) => { console.log(e.altKey); }} ref={forwardedRef} css={{ borderTopColor: 'AliceBlue', backgroundColor: 'ActiveText', backgroundAttachment: 'inherit' }}/>
			<Text onClick={(e) => { console.log(e.altKey); }} ref={forwardedRef} css={{ backgroundColor: '$red100', backgroundClip: 'border-box', ml: 'auto', "@bp1": {
                backgroundAttachment: 'fixed'
            }, "@bp10": {
                backgroundColor: 'ActiveText', backgroundClip: 'border-box'
            } }}/>
			<Text onClick={(e) => { console.log(e.altKey); }} ref={forwardedRef} css={{ backgroundColor: '$red100', backgroundAttachment: 'inherit', backgroundOrigin: 'border-box' }}/>
			<Text as="b" onClick={(e) => { console.log(e.altKey); }} ref={forwardedRef} css={{ ...props.css, backgroundColor: '$red100', padding: 'initial', "@bp3": {
                backgroundColor: '$red100',
                backdropFilter: ''
            }
        }}/>
			<Text as="div" onClick={(e) => { console.log(e.altKey); }} css={{ ...props.css, backgroundColor: '$red100', background: 'red', paddingLeft: 'initial' }}/>
			<Text as="div" onClick={(e) => { console.log(e.altKey); }} css={props.css}/>
			<Text as={DEFAULT_TAG} {...props} onClick={(e) => { console.log(e.altKey); }} ref={forwardedRef}/>
		</>);
});
const App = () => {
    // when consuming the component it should be very fast too
    return <Heading css={{ backgroundColor: '$red100', padding: 'inherit', colorScheme: 'dark' }}/>;
};
