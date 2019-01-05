# Swift for all
## A Zeplin's extension

Zeplin's built-in Swift extension is very useful, but is only available on Swift projects. 

You are an Swift developer and you are working on an app which is only available in Zeplin as an Android project. Or maybe you just want to export the color palette of this beautiful web project to use in your code? 

**Swift for all** gives you access to Swift code on all Zeplin projects! 
Whether it is a web, iOS, Android or macOS project, **Swift for all** won't let you down.

## Getting Stated
1. Go to https://extensions.zeplin.io/
2. Search "Swift for all" in the extension
3. Click on "Add to Zeplin"

## Usage

**Swift for all** currently only generates Swift code for your project's styleguide. Snippets are not available when selecting layers in a screen.

### Colors

All colors are defined in a struct in UIColor. By default the struct is named from the project but you can override its name in the extension's parameters.

```swift
extension UIColor {
  struct MyProject {
    static let blue1 = UIColor(red: 68/255.0, green: 104/255.0, blue: 234/255.0, alpha: 1)
    static let blue2 = UIColor(red: 0/255.0, green: 36/255.0, blue: 166/255.0, alpha: 1)
    static let pink = UIColor(red: 255/255.0, green: 48/255.0, blue: 97/255.0, alpha: 1)
    static let black = UIColor(red: 0/255.0, green: 0/255.0, blue: 0/255.0, alpha: 1)
    static let grey = UIColor(red: 102/255.0, green: 102/255.0, blue: 102/255.0, alpha: 1)
    static let red = UIColor(red: 227/255.0, green: 0/255.0, blue: 36/255.0, alpha: 1)
  }
}

view.backgroundColor = UIColor.MyProject.pink
```

### Text styles

Unlike the original Swift extension which only generate code for fonts, **Swift for all** generates the actuel text style by using all available parameters: font, font size, line height, text color, letter spacing, etc.

Text styles are listed in a `TextStyle` enum, and all attributes are handled with `NSAttributedString` attributes:
```swift
enum TextStyle {
  case title
  case subtitle
  case body
}

extension TextStyle {
  var attributes: [NSAttributedString.Key: Any] {
    switch self {
    case .title:
      let paragraphStyle = NSMutableParagraphStyle()
      paragraphStyle.alignment = .center
      paragraphStyle.minimumLineHeight = 28.2
      return [.font: UIFont(name: "Canaro-Bold", size: 20),
              .paragraphStyle: paragraphStyle,
              .foregroundColor: UIColor.MyProject.blue1]

    case .subtitle:
      let paragraphStyle = NSMutableParagraphStyle()
      paragraphStyle.alignment = .center
      paragraphStyle.minimumLineHeight = 24
      return [.font: UIFont(name: "Canaro-Bold", size: 18),
              .paragraphStyle: paragraphStyle,
              .foregroundColor: UIColor(red: 48/255.0, green: 45/255.0, blue: 112/255.0, alpha: 1)]

    case .body:
      return [.font: UIFont(name: "Roboto-Medium", size: 13)]
    }
  }
}


label.attributedText = NSAttributedString(string: "Hello world", attributes: TextStyle.title.attributes)
```

When exporting the textStyles in a file, **Swift for all** also includes an utility function to shorten textStyle usages. The above code can then become:
```swift
label.attributedText = "hello world".styled(as: .title)
```

Did you notice ? `title` and `subtitle` styles both declare a text color, but it is not equally formatted. That is because the color used by the `title` style is actually in the project's color palette so we can directly get it from there. In the other hand, the `subtitle` text color is not in the palette and is hence declared here.

You can also choose the way font are used in attributes from the extension's parameters. By default the classic built-in UIKit initialiser is used:
```swift
case .body:
  return [.font: UIFont(name: "Roboto-Medium", size: 13)]
```
But you may already use a tool like [SwiftGen](https://github.com/SwiftGen/SwiftGen) to avoid relying on String in your project. If do you, select the `SwiftGen` option and you will get this:
```swift
case .body:
  return [.font: FontFamily.Roboto.medium.font(size: 13)]
```


## What's next ?

Here is a non-exhaustive list of future features to come:
- [ ] Shorten the color declaration by using an extension
- [ ] Add the possibility to use `NSAttributedString.Key.lineSpacing` instead of  `NSAttributedString.Key.minimumLineHeight`
- [ ] Generate screen snippets on text layers
- [ ] Select the Swift version as with the original Swift extension


## License
**Swift for all** is available under the MIT license. See the LICENSE file for more info.

