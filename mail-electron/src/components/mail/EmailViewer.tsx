import React, { useEffect, useState } from 'react';
import juice from 'juice'; // Import the juice library

const EmailViewer = ({ rawHtmlContent }: {
    rawHtmlContent: string
}) => {
    const [bodyContent, setBodyContent] = useState('');

    useEffect(() => {
        const parseAndInlineStyles = (html: string) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const body = doc.body;
            
            // Extract body content
            const extractedBodyContent = body ? body.innerHTML : '';

            // Inline styles using juice
            // const inlinedBodyContent = juice(extractedBodyContent);

            console.log(extractedBodyContent);

            if (extractedBodyContent) {
                const inlinedBodyContent = juice(extractedBodyContent);
                setBodyContent(inlinedBodyContent);
            } else {
                // Handle the case where extractedBodyContent is null or undefined
                console.error('Invalid HTML content');
            }

        };

        parseAndInlineStyles(rawHtmlContent);
    }, [rawHtmlContent]);

    return (
        <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
    );
};

export default EmailViewer;
