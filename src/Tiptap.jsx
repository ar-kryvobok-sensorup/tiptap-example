

import React, {useState} from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Mention from '@tiptap/extension-mention'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'

import suggestion from './suggestion'
import { prepareHtmlForSave, processHtmlForEditor } from './utils'

const initialHtml = `
  <p>Here are <strong>some</strong> <em>details</em> <u>about</u> <span style="color: rgb(230, 0, 0);">the</span> <span
  style="background-color: rgb(102, 185, 102);">leak</span>:</p>
  <p>lorem ipsum {properties.issueId} dolor sit amet</p>
  <p><br></p>
  <ol>
  <li><span style="color: rgb(102, 102, 102);">Lorem ipsum </span></li>
  <li><span style="color: rgb(102, 102, 102);">dolor sit amet,</span></li>
  </ol>
  <p><br></p>
  <ul>
  <li><span style="color: rgb(102, 102, 102);">Aenean massa. </span></li>
  <li><span style="color: rgb(102, 102, 102);">Cum sociis </span></li>
  </ul>
  <p><br></p>
  <p><span style="color: rgb(102, 102, 102);">Donec quam felis, </span></p>
  <p class="ql-align-center"><span style="color: rgb(102, 102, 102);">ultricies nec, pellentesque eu, </span></p>
  <p class="ql-align-right"><span style="color: rgb(102, 102, 102);">pretium quis, sem.</span></p>
  <h6><span style="color: rgb(102, 102, 102);">Donec pede justo</span></h6>
  <h1><span style="color: rgb(102, 102, 102);">In enim justo, </span></h1>
`

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleCode()
            .run()
        }
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        code
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      >
        h4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
      >
        h5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
      >
        h6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        blockquote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button>
       <input
        type="color"
        onInput={event => editor.chain().focus().setColor(event.target.value).run()}
        value={editor.getAttributes('textStyle').color}
      />
        <button onClick={() => editor.chain().focus().unsetColor().run()}>unsetColor</button>
       <input
        type="color"
        onInput={event => editor.chain().focus().toggleHighlight({color: event.target.value}).run()}
        value={editor.getAttributes('highlight').color}
      />
       <button
        onClick={() => editor.chain().focus().unsetHighlight().run()}
        disabled={!editor.isActive('highlight')}
      >
        unsetHighlight
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        redo
      </button>
    </>
  )
}

const Tiptap = () => {
  const [displayedHtml, setDisplayedHtml] = useState('')
  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion,
        renderLabel({  node }) {
          return `${node.attrs.label ?? node.attrs.id}`
        }
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true })
    ],
      onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const preparedHtml =  prepareHtmlForSave(html)
      setDisplayedHtml(preparedHtml)
  },
    content: processHtmlForEditor(initialHtml)
  })

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <textarea value={displayedHtml} style={{width: '900px', height: '300px'}} />
    </div>
  )
}

export default Tiptap