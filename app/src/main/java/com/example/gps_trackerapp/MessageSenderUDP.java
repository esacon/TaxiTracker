package com.example.gps_trackerapp;

import android.os.AsyncTask;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

public class MessageSenderUDP extends AsyncTask<String, Void, Void> {

    private String destIp;
    private int port;
    private DatagramSocket socket;
    private InetAddress serverAddress;

    public MessageSenderUDP(String destIp, int port) {
        this.destIp = destIp;
        this.port = port;
        this.socket = null;
        this.serverAddress = null;
    }

    @Override
    protected Void doInBackground(String... voids) {
        String message = voids[0];
        try {
            socket = new DatagramSocket();
            serverAddress = InetAddress.getByName(this.destIp);
            byte[] msg = message.getBytes(StandardCharsets.UTF_8);
            DatagramPacket packet = new DatagramPacket(msg, msg.length, serverAddress, this.port);
            socket.send(packet);
            socket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
