package com.koi.rn.nativemodule;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Collections;
import java.util.List;

/**
 * Created by Linh Nguyen on 5/28/2017.
 */

public class NetworkModule extends ReactContextBaseJavaModule {

    public NetworkModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "NetworkInfo";
    }

    // https://stackoverflow.com/questions/6064510/how-to-get-ip-address-of-the-device-from-code
    @ReactMethod
    public void getIPAddress(Callback errorCallback, Callback successCallback) {
        try {
            List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());

            for (NetworkInterface intf : interfaces) {
                List<InetAddress> addrs = Collections.list(intf.getInetAddresses());

                for(InetAddress addr : addrs) {
                    if (!addr.isLoopbackAddress()) {
                        String sAddr = addr.getHostAddress();
                        boolean isIPv4 = sAddr.indexOf(':') < 0;

                        if (isIPv4) {
                            successCallback.invoke(sAddr);
                            return;
                        } else {

                        }
                    }
                }
            }
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }
}
