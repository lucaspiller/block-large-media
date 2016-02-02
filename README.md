# Block Large Media (Chrome Extension)

Block Large Media is a Chrome Extension that will block large media files from
being downloaded and sucking up all your bandwidth.

Although a lot of people still have low bandwidth connections and limited data
caps, articles are getting more and more ambious and having 3mb header images
isn't uncommon ([example](http://www.wired.com/2016/01/drones-arent-just-toys-anymore/)).

[uBlock Origin introduced a
feature](https://github.com/gorhill/uBlock/issues/1163) to block large images
however it works rather naively. First of all the request isn't blocked until
after the browser has started to receive data. If you have a high bandwidth
connection, but the time the TCP connection has been closed and the upstream
server has realised, you may have already downloaded half the image. The second
thing is that it just hides images large than that size, but there is a better
way...

This extension uses the [Range header introduced in
HTTP/1.1](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html) to request
the server only send up to a maximum file size. If the server has a 300kb
image, this means, for example, you can request only the first 50kb to be sent.
This on it's own isn't very useful as you'll get half an image, but all
standard image formats (GIF, PNG, JPG) support progressive images. If a browser
only receives 50kb of a 300kb progressive image, it will render the full image
but at a lower quality.

Unfortunately it's not quite a win-win situation. Not all images on the web are
progressive (Flickr I'm looking at you), and not all servers support the Range
header (even though it's 17 years old). This extension also checks the response
headers to see how big an image is, and if it's bigger than the configured
limit will block the request (the same as uBlock Origin).

# Installation

Download the latest release from the [GitHub releases
section](https://github.com/lucaspiller/block-large-media/releases).

# Configuration

In the Chrome extensions screen, go to Options and you can set the maximum
size. It's currently only possible to set a global limit.

# TODO

* Block other types of media (video, web fonts)
* Configurable limit per domain
* Easy way to toggle it on/off
* Show a more helpful image when something is blocked rather than a broken image

Pull requests are welcome :)

# License

See LICENSE.md.
