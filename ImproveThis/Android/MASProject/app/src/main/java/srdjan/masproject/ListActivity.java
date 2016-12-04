package srdjan.masproject;

import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.view.View;
import android.widget.ExpandableListView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class ListActivity extends AppCompatActivity {

    ExpandableListAdapter listAdapter;
    ExpandableListView expListView;
    List<String> listDataHeader;
    HashMap<String, List<String>> listDataChild;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setDisplayShowHomeEnabled(true);
        }



        // get the listview
        expListView = (ExpandableListView) findViewById(R.id.expandableListView);

        // preparing list data
        prepareListData();

        listAdapter = new ExpandableListAdapter(this, listDataHeader, listDataChild);

        // setting list adapter
        expListView.setAdapter(listAdapter);
    }

    private void prepareListData() {
        listDataHeader = new ArrayList<>();
        listDataChild = new HashMap<>();

        // Adding child data
        listDataHeader.add("Thing is broken");
        listDataHeader.add("Could use more bike racks");
        listDataHeader.add("Bad smell");

        // Adding child data
        List<String> top250 = new ArrayList<>();
        top250.add("Comment");
        top250.add("Comment");
        top250.add("Comment");
        top250.add("Comment");
        top250.add("Comment");
        top250.add("Comment");
        top250.add("Comment");

        List<String> nowShowing = new ArrayList<>();
        nowShowing.add("Comment");
        nowShowing.add("Comment");
        nowShowing.add("Comment");
        nowShowing.add("Comment");
        nowShowing.add("Comment");
        nowShowing.add("Comment");

        List<String> comingSoon = new ArrayList<>();
        comingSoon.add("Comment");
        comingSoon.add("Comment");
        comingSoon.add("Comment");
        comingSoon.add("Comment");
        comingSoon.add("Comment");
        comingSoon.add("Comment");

        listDataChild.put(listDataHeader.get(0), top250); // Header, Child data
        listDataChild.put(listDataHeader.get(1), nowShowing);
        listDataChild.put(listDataHeader.get(2), comingSoon);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // handle arrow click here
        if (item.getItemId() == android.R.id.home) {
            finish(); // close this activity and return to preview activity (if there is any)
        }

        return super.onOptionsItemSelected(item);
    }

}
