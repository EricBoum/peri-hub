import AppKit
import Foundation

let width: CGFloat = 660
let height: CGFloat = 400

let outputPath = "src-tauri/icons/dmg-background.png"
let iconPath = "src-tauri/icons/icon.png"

func drawRoundedRect(_ rect: NSRect, radius: CGFloat, color: NSColor) {
  let path = NSBezierPath(roundedRect: rect, xRadius: radius, yRadius: radius)
  color.setFill()
  path.fill()
}

let canvas = NSImage(size: NSSize(width: width, height: height))
canvas.lockFocus()

let backgroundGradient = NSGradient(
  colors: [
    NSColor(calibratedRed: 0.95, green: 0.97, blue: 1.00, alpha: 1.0),
    NSColor(calibratedRed: 0.89, green: 0.93, blue: 0.99, alpha: 1.0)
  ]
)
backgroundGradient?.draw(in: NSRect(x: 0, y: 0, width: width, height: height), angle: 270)

drawRoundedRect(NSRect(x: 32, y: 258, width: width - 64, height: 112), radius: 18, color: NSColor.white.withAlphaComponent(0.58))

let titleAttributes: [NSAttributedString.Key: Any] = [
  .font: NSFont.boldSystemFont(ofSize: 30),
  .foregroundColor: NSColor(calibratedRed: 0.10, green: 0.16, blue: 0.25, alpha: 1.0)
]
let subtitleAttributes: [NSAttributedString.Key: Any] = [
  .font: NSFont.systemFont(ofSize: 16, weight: .medium),
  .foregroundColor: NSColor(calibratedRed: 0.24, green: 0.33, blue: 0.48, alpha: 1.0)
]
let footerAttributes: [NSAttributedString.Key: Any] = [
  .font: NSFont.systemFont(ofSize: 14, weight: .regular),
  .foregroundColor: NSColor(calibratedRed: 0.33, green: 0.40, blue: 0.54, alpha: 1.0)
]

let title = NSString(string: "peri-hub")
title.draw(at: NSPoint(x: 64, y: 320), withAttributes: titleAttributes)

let subtitle = NSString(string: "Drag peri-hub to Applications to install")
subtitle.draw(at: NSPoint(x: 64, y: 287), withAttributes: subtitleAttributes)

let footer = NSString(string: "Tip: Launch from Applications after copying")
footer.draw(at: NSPoint(x: 64, y: 42), withAttributes: footerAttributes)

let iconRect = NSRect(x: 165, y: 150, width: 96, height: 96)
if let icon = NSImage(contentsOfFile: iconPath) {
  icon.draw(in: iconRect)
}

let arrowPath = NSBezierPath()
arrowPath.lineWidth = 7
arrowPath.lineCapStyle = .round
NSColor(calibratedRed: 0.25, green: 0.44, blue: 0.75, alpha: 0.88).setStroke()
arrowPath.move(to: NSPoint(x: 304, y: 198))
arrowPath.line(to: NSPoint(x: 380, y: 198))
arrowPath.stroke()

let arrowHead = NSBezierPath()
arrowHead.move(to: NSPoint(x: 380, y: 198))
arrowHead.line(to: NSPoint(x: 362, y: 214))
arrowHead.line(to: NSPoint(x: 362, y: 182))
arrowHead.close()
NSColor(calibratedRed: 0.25, green: 0.44, blue: 0.75, alpha: 0.88).setFill()
arrowHead.fill()

canvas.unlockFocus()

guard
  let tiffData = canvas.tiffRepresentation,
  let bitmap = NSBitmapImageRep(data: tiffData),
  let pngData = bitmap.representation(using: .png, properties: [:])
else {
  fputs("Failed to generate PNG data.\n", stderr)
  exit(1)
}

do {
  try pngData.write(to: URL(fileURLWithPath: outputPath))
  print("Generated \(outputPath)")
} catch {
  fputs("Failed to write file: \(error)\n", stderr)
  exit(1)
}
