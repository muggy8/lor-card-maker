import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_webview_pro/webview_flutter.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';

void main() {
  runApp(const AppView());
}

class AppView extends StatefulWidget {
  const AppView({super.key});

  @override
  State<AppView> createState() => _AppViewState();
}

class _AppViewState extends State<AppView> {
    late WebViewController _webViewController;

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return MaterialApp(
      title: 'LoR Card Maker',
      home: WillPopScope(
        onWillPop: () async {
          if (await _webViewController.canGoBack()){
            _webViewController.goBack();
            return false;
          }
          return true;
        },
        child: Scaffold(
          body: SafeArea(
            child: Builder(builder: (BuildContext context) {
              return WebView(
                initialUrl: 'https://muggy8.github.io/lor-card-maker/',
                // initialUrl: 'http://localhost:1337/',
                javascriptMode: JavascriptMode.unrestricted,
                gestureNavigationEnabled: true,
                geolocationEnabled: false,
                onWebViewCreated: (WebViewController webViewController) {
                  _webViewController = webViewController;
                  // _webViewController.
                  _webViewController.runJavascript("window._native = true");
                },
                javascriptChannels: {
                  JavascriptChannel(
                    name: 'messageHandler',
                    onMessageReceived: (JavascriptMessage message) async {
                      Map<String, dynamic> shareData = jsonDecode(message.message);
                      Uint8List bytes = base64.decode(shareData["image"]);
                      Directory tempDir = await getTemporaryDirectory();
                      String savePath = "${tempDir.path}/${shareData["fileName"]}";
                      File file = File(savePath);
                      await file.writeAsBytes(bytes);

                      Share.shareXFiles([
                        XFile(savePath)
                      ]);
                    })
                },
              );
            })
          ),
        ),
      )
    );
  }
}