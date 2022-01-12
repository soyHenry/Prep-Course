const Cache = require('@11ty/eleventy-cache-assets')

module.exports = async function () {
  const url = 'https://henry-11ty-resources.s3.sa-east-1.amazonaws.com/Assets/logo-henry-white-sm.png'
  const imageBuffer = await Cache(url, {
    duration: '1d',
    type: 'buffer'
  })
  // Use imageBuffer as an input to the `sharp` plugin, for example
  return imageBuffer
  // (Example truncated)
}
