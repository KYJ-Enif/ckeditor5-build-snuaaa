/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/*eslint linebreak-style: ["error", "windows"]*/

import axios from 'axios';
// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';

export default class ClassicEditor extends ClassicEditorBase {}


const SERVER_URL = 'http://192.168.123.100:8080/'


class MyUploadAdapter {
    constructor(loader) {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        // Update the loader's progress.
        return this.loader.file
            .then(uploadFile => {
                return new Promise((resolve, reject) => {
                    const data = new FormData();
                    data.append('attachedImage', uploadFile);

					axios.post(`${SERVER_URL}api/image`, data
					// {
                        // onUploadProgress: (data) => {
                        //     this.loader.uploadTotal = data.total;
                        //     this.loader.uploaded = data.uploaded;
                        // }
					// }
					).then(response => {
                        if (response.data.result === 'success') {
                            resolve({
                                default: `${SERVER_URL}static/${response.data.imgPath}`
                            });
                        } else {
                            reject(response.data.message);
                        }
                    }).catch(response => {
                        reject('Upload failed');
                    });
                })
            })
    }

    // Aborts the upload process.
    abort() {
        // Reject the promise returned from the upload() method.
        console.warn("upload abort")
        // server.abortUpload();
    }
}


function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter(loader);
    };
}


// const editorConfiguration = {
// 	plugins: [Essentials, Heading, Bold, Italic, Paragraph, List, TodoList, Image, InsertImage, ImageCaption, Table, TableToolbar, FileRepository, Strikethrough, Subscript, Underline],
// 	// extraPlugins: [MyCustomUploadAdapterPlugin],
// 	toolbar: ['heading', '|', 'bold', 'italic', 'Strikethrough', 'Subscript', '|', 'link', 'bulletedList', 'numberedList', 'todoList', 'blockQuote', '|',
// 		'undo', 'redo', '|',
// 		'insertImage', 'insertTable'],
// 	image: {
// 		toolbar: ['imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative']
// 	},
// 	table: {
// 		contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
// 	}
// };



// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	BlockQuote,
	// EasyImage,
	Heading,
	Image,
	ImageResize,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar
];
// Editor configuration.
ClassicEditor.defaultConfig = {
	extraPlugins: [MyCustomUploadAdapterPlugin],
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'link',
			'bulletedList',
			'numberedList',
			'|',
			'indent',
			'outdent',
			'|',
			'imageUpload',
			'blockQuote',
			'insertTable',
			'mediaEmbed',
			'undo',
			'redo'
		]
	},
	image: {
		toolbar: [
			'imageStyle:full',
			'imageStyle:side',
			'|',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};
