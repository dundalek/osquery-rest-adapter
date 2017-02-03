# REST adapter for osquery compatible with Vega

This adapter allows you to visualize information about your OS, for example see running processes, hardware devices or opened ports. It does that by  making [osquery](https://osquery.io/) data available as a REST endpoint. You can then browse and visualize the information using [Voyager](https://www.github.com/vega/voyager) or [Polestar](https://www.github.com/vega/polestar).

![PCI devices visualized using Voyager](example.gif)

## Usage

Install: `npm install -g osquery-rest-adapter`

Run it: `osquery-rest-adapter`

Use different port (default is 8080): `PORT=3003 osquery-rest-adapter`

## Prerequisites

1. [Install osquery](https://osquery.io/downloads/) (you do not need to run `osqueryd`, only `osqueryi` needs to be available)
2. Download [Voyager](https://www.github.com/vega/voyager) or [Polestar](https://www.github.com/vega/polestar)
3. After opening Voyager or Polestar, add a dataset using *From Myria* tab. Put in `http://localhost:8080`, click update and select the table you want to explore.

## Standalone queries

This adapter is best used by visualization tools. But you can also use the REST endpoint directly.

### Get list of available datasets

You can use optional `q` parameter for search.

`curl localhost:8080/dataset/search?q=usb`

```
[{
  "userName": "local",
  "programName": "osquery",
  "relationName": "usb_devices"
}]
```

### Fetch a dataset

In this example we fetch list of `usb_devices` in the system.

`curl localhost:8080/dataset/user-local/program-osquery/relation-usb_devices/data`

## Technical details

*Voyager* and *Polestar* use common components from [vega-lite-ui](https://github.com/vega/vega-lite-ui) that provide dataset loading functionality. One option is to load datasets from the [Myria](https://github.com/uwescience/myria) platform. This adapter works by providing small subset of API compatible with *Myria* so that *vega-lite-ui* can connect to it.

**Warning!** This adapter exposes information about your system, so make sure to configure your firewall if you want to use it in a public or untrusted network.

## See also

- [Envdb](https://github.com/mephux/envdb) is a web app that provides GUI for querying osquery. It helps you to browse and see the results in tables. An extra feature is that you can connect multiple machines to a cluster and run queries on all of them at the same time.
- [Dashiell](https://github.com/maclennann/dashiell) is a web app that allows you to query osquery and also [facter](https://github.com/puppetlabs/facter) (which is internally used by [Puppet](https://puppetlabs.com/)).
- [osquery-node](https://github.com/sidorares/osquery-node) is an advanced osquery client for node.js. It also allows you to write custom plugins for osquery in javascript.
- [mysql-osquery-proxy](https://github.com/sidorares/mysql-osquery-proxy) allows you to use osquery with a mysql-compatible client.
