/* global CMS */

CMS.registerEditorComponent({
  id: 'gallery',
  label: 'Gallery',
  widget: 'object',
  fields: [{
    name: 'gallery',
    widget: 'list',
    fields: [
      {
        label: 'Image or youtube video',
        name: 'imageOrYoutube',
        widget: 'object',
        fields: [
          { label: 'Title', name: 'title', widget: 'string' },
          {
            label: 'Type',
            name: 'type',
            widget: 'select',
            required: true,
            options: [
              { label: 'Image', value: 'image' },
              { label: 'Video', value: 'video' },
            ],
          },
          { label: 'Image', name: 'image', widget: 'image', required: false },
          { label: 'Youtube video ID', name: 'videoid', widget: 'string', required: false },
        ],
      },
    ],
  }],
  pattern: /^{{< gallery >}}(.*?){{< \/gallery >}}/ms,
  fromBlock (match) {
    return {
      gallery: JSON.parse(match[1] || ''),
    }
  },
  toBlock (obj) {
    return `{{< gallery >}}${JSON.stringify(obj.gallery)}{{< /gallery >}}`
  },
})
