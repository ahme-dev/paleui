FROM oven/bun:slim

RUN apt-get update && apt-get install -y \
	git \
	curl \
	wget \
	unzip \
	sudo \
	locales \
	&& sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen \
	&& locale-gen \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

ENV LANG=en_US.UTF-8 \
	LANGUAGE=en_US:en \
	LC_ALL=en_US.UTF-8

RUN chsh -s /bin/bash bun

USER bun
WORKDIR /workspace