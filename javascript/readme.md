install: 

- sublime text: sublimeserver
- sublime text: sidebar enhancements

right click on .html and edit project->edit preview urls
add something like: 

```
{
    "/Users/zachlieberman/Desktop/masQueLaCara": {
        "url_testing":"http://localhost/masQueLaCara",
        "url_production":"http://www.project.com"
    }
}
```

then run the server via tools->sublimeserver and right click on the html and say "open in browser->default"

you can add key bindings like this: 

http://www.hongkiat.com/blog/preview-in-localhost/

```
[
    { "keys": ["command+shift+r"],
        "command": "side_bar_open_in_browser" ,
        "args":{"paths":[], "type":"testing"}
    }
]
```

you can also install https://github.com/gcollazo/BrowserRefresh-Sublime

keybindings like this mean you can launch in browser and referesh using key commands... (command shift b, command shift r)

```
[
	{ "keys": ["command+shift+b"],
        "command": "side_bar_open_in_browser" ,
        "args":{"paths":[], "type":"testing"}
    },
    {
      "keys": ["command+shift+r"], "command": "browser_refresh", "args": {
        "auto_save": true,
        "delay": 0.0,
        "activate": true,
        "browsers" : ["chrome"]
      }
    }
]
```


