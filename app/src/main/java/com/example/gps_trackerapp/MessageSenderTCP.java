package com.example.gps_trackerapp;

import android.os.AsyncTask;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;

public class MessageSenderTCP extends AsyncTask<String, Void, Void> {
    Socket s;
    PrintWriter pw;

    private String destIp;
    private int port;

    public MessageSenderTCP(String destIp, int port) {
        this.destIp = destIp;
        this.port = port;
    }

    @Override
    protected Void doInBackground(String... voids) {
        String message = voids[0];
        try {
            s = new Socket(this.destIp, this.port);
            pw = new PrintWriter(s.getOutputStream());
            pw.write(message);
            pw.flush();
            pw.close();
            s.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}